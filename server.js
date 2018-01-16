//How to start a project

//1.- npm init (npm == node package manager) -> this will init the package.json file and the project
//2.- install dependencies (express, morgan, body-parser)
//         npm install --save express
//3.- Create a basic node server file 'server.js'

const express = require('express'); //we require the express library
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Route files
//const itemRoutes = require('./routes/item-routes'); //Routes step 3.- Require the routes for each file
const goalRoutes = require('./routes/goal-routes');
const authRoutes = require('./routes/auth-routes');

const config = require('./config');

const app = express(); //we create the server inside the app variable
const port = process.env.PORT || config.localPort; //specify the port

const db = mongoose.connection;

//Some configurations
app.use(morgan('common')); //use morgan to log
app.use(bodyParser.json()); //Parse everything as json format

//Where to serve static content
app.use(express.static('public'));

app.get("/", (request, response) => {
    response.sendFile(__dirname + '/public/index.html');
});


//Database config
mongoose.connect(config.databaseUrl, { useMongoClient: true });
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to a database')
});

app.all('/');
app.use('/goal', goalRoutes);
app.use('/auth', authRoutes);

//start our server. This means that the server will be listening to all the requests
app.listen(port, () => {
    console.log(config.serverRunningMessage + config.localPort);
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run

let server;

// this function connects to our database, then starts the server
function runServer() {

    mongoose.connect(config.databaseUrl, { useMongoClient: true });
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => {
        console.log('Connected to a database')
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    mongoose.disconnect(config.databaseUrl);
    db.once('close', () => {
    	console.log('Closed database');
    })
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
/*if (require.main === module) {
    runServer().catch(err => console.error(err));
};*/

module.exports = { app, runServer, closeServer };

//4.- to run the server -> node server.js
//5.- With nodemon now its nodemon server.js and will listen to any change
//6.- to run this code you will have to install all dependencies with npm install