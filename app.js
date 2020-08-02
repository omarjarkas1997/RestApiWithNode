const express = require('express');
const app = express();

// body parser
var bodyParser = require('body-parser');
// mongoose ORM
var mongoose = require('mongoose');
// routes for navigation
var routes = require('./routes/routes');
// morgan logger
var logger = require('morgan');

// connecting to mongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/issuelogs",{ useNewUrlParser: true, useUnifiedTopology: true });

// there is a warning of deprication
// this gets ride of it
mongoose.set('useCreateIndex', true);

// representation of the connect to the db
// referencing the db connection
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console,'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// use the routes as home page url '/'
app.use('/', routes);

//catch 404 error and forward it to the error hander
app.use(function(req,res,next){
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error Handler

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({
        error : err.message
    })
});

const port = process.env.PORT || 3000;


app.listen(3000, () =>{
    console.log('Server running on port: ', port);
});


