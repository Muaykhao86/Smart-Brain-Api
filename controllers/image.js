// Below - to hide the api key we bring it to the back end
const Clarifai = require ('clarifai')

const app = new Clarifai.App({
    apiKey: 'f8978a054ffe4decacee5664698ef9bf'
   })

const handleApiCall = (req, res) =>{
app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);  
    })
    .catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, res, db) => {
    const {id} = req.body;
    // note = not === as its sql not js
    // from the table users in database, where the id is {id} that we recive in params we
    // update the entries plus 1 using the knex method increments and return the entries using knex
    // method returning and responding/changing to json the first(and only) object in the array
    db('users').where('id', '=', id)
    // .increment(column, amount)
    .increment('entries', 1)
    // .returning(column) / .returning([column1, column2, ...])
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.json('could not get entries'))
 }

module.exports= {
    // Below- on es6 you dont have to write this you can just write...
    // handleImage: handleImage,
    // handleApiCall: handleApiCall
    handleImage,
    handleApiCall
};