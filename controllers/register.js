const handleRegister = (db, bcrypt) => (req, res) => {
    // Below- Destructured from the body
    const {email, name, password} = req.body;
    // Below - if any of these fields are blank/opposite then it returns true and stops regitration
    if (!email||!name||!password){
        return res.status(400).json('incorrect form registration');
    }
    // Below sycronously changing the password given to a hash using bcrypt
    const hash = bcrypt.hashSync(password);
    // ! We create a transaction to update more than one table/need to do more than one thing and you use the trx object
    // ! instead of the .db to do these operations
    db.transaction(trx =>{
    // ! The transaction I create is taking the hash that I create from the password using bcrypt method and 
    // ! the email from the body that is destructured above
        trx.insert({
            hash: hash,
            email: email,
        })
    // ! I insert them into login table and return the email that will also be shared with the user table
        .into('login')
        .returning('email')
    // ! The email that has been returned from above is then put into another trx transaction in the users table
        .then( loginEmail => {
    // ! So in users, insert the new user and return all the columns
    // ! We have a return because a promise must always return somthing!
            // returning trx(users) instead of db(users) as its now part of the transaction
            return trx('users')
            // returning the response of all columns from knex .returning(column/s)
            .returning('*')
            // inserting using knex to our database
            // .insert(data, [returning]) 
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
    // Below- returning the first item(object) of the array[0], NOT a array
        .then(user => 
    // ! and responding with a json of the returned columns fron the 2nd transaction
        res.json(user[0]))
    })
    // ! then in order for it to get added I have to commit it providing all the above passes
    .then(trx.commit)
    // ! and if theres any problem I rollback the changes
    .catch(trx.rollback)   
    })
    // Below - catching any faults tha might occur, not returning info about our server just a msg/ Below- catching if a user name is taken  
    .catch(err=> res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
};