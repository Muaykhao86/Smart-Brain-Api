const handleProfileGet = (req, res, db) => {
    const {id} = req.params;
// Below- selecting everything from the users table by the given param id(where the id = param id) then giving back the user
    db.select('*').from('users').where({id}).then(user=>{
// if we get a user back length = >1 then respond with the user, if not respond with a error and if there is a error(fetching the table etc) respond with error
        if (user.length){ 
            res.json(user[0]);
        }else{
            res.status(400).json('no such user!')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
     
 }

module.exports = {
    handleProfileGet: handleProfileGet
};
