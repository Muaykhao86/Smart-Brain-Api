const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json('Incorrect form subbmission')
    }
    // ! On sign in im getting the email and hash from the table login
        db.select('email', 'hash').from('login')
    // ! where the email matches the request email (note = not === as its sql not js)
        .where('email', '=', email)   
    // ! the data returned is the hash
        .then(data => {
    // ! I compare the password given (changing it to a hash using bcrypt) to the hash stored from register in the login table
    // Below- compareSync is a bcrypt method
            const isValid = bcrypt.compareSync(password, data[0].hash);
    // ! if its valid then im returning all columns from users table
            if (isValid){
                return db.select('*').from('users')
    // ! where the email is the same as the email given
                    .where('email', '=', email)
    // ! and respond the returned user as a json file the first item(object) in the user array
                    .then(user=>{
                    res.json(user[0])
                    })
    // ! If theres a error we catch it and respond with...
                    .catch(err => res.status(400).json('unable to get user'))
    // ! If the password is wrong we give this status
            }else{
                res.status(400).json('wrong credentials')
            }
    // ! If the email doesnt match we give this status
        }).catch(err=> res.status(400).json('wrong credentials'))
    }

module.exports = {
    handleSignin: handleSignin
};


// Below- Encription for password for asyncronous from bcrypt
// bcrypt.hash(password, null, null, function(err, hash) {
//     console.log(hash);
// Store hash in your password DB.
// });
