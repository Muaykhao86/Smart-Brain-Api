const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const app = express();

app.use(bodyParser.json());
app.use(cors());

// To connect server to database
// Below- knex has to be assigned to a variable that we can select/insert etc from/to
const db = knex ({
    client: 'pg',
    connection: {
    // Below 127.0.0.1 = home/localhost 
      host : '127.0.0.1',
      user : 'danielhardiman',
      password : '',
      database : 'smart-brain'
    }
  });

app.get('/', (req, res) => {res.send(database.users)})

// Below - dependency injection {(req, res, db, bcrypt)}- injecting whatever dependencies
// handleRegister needs 
app.post('/signin',(req, res) => {signin.handleSignin(req, res, db, bcrypt)})
// Below - Advanced Functions - you can run the function passing db and bcrypt and then 
// run it again for the req, res (see register.js) , just looks cleaner and does the same thing
app.post('/register', register.handleRegister( db, bcrypt))

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, ()=> {console.log(`nodemone is running on port 3000`)})


/* These are the end points that I expect
/ --> res = this is working
/signin --> POST = (hidden password) success/fail
/register --> POST = (new) user
/profile/:userid --> GET = user(profile)
/image -- PUT --> (update the users image) user
*/
// Below will grab the last user/item in the array
// res.json(database.users[database.users.length-1 ]) 
