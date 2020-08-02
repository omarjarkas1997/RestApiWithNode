var express = require('express');
var router = express.Router();
var User = require('../models/user');

var bcrypt = require('bcrypt');


router.get('/',(req,res) => {
    res.send('Helloooooooooo! It works!');
});


// Getting all the users 

router.get('/users', function(req, res, next){
    var users;
    User.find({}, (err, users) => {
        users.forEach(user => {
            console.log(user.firstName+" has a password "+user.email);
            res.json(users);
        })
    });
});

// register a new user

router.post('/register', function(req,res,next) {
    const body = req.body;
    console.log(body);
    if( body.firstName &&  body.lastName && 
        body.email && body.password && body.confirmPassword){
            var userDetails = {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: body.password,
            };
            User.create(userDetails, (err, user) => {
                if(err) {
                    return next(err);
                } else {
                    res.json({
                        message:'User is created successfully!',
                        user: user});
                }
            });
    } else {
        err = new Error('Some or all Feilds are missing!');
        res.status(400);
        next(err);
    }
});

// getting a user by email

router.get('/user',(req,res) =>{
    if( req.body.email && req.body.password){
        User.findOne({ email: req.body.email}, (err, user) =>{
            if(err) {
                return callback(err);
            } else if (!user) {
                var err = new Error('User Not Found');
                err.status = 400;
                next(err);
            }
            res.json(user);
        });
    } else {
        Err = new Error("Fields are missing");
        res.status(400);
        next(err);
    }
});

// authenticating users and logining in 

router.get('/login', (req, res) => {
    if( req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error || !user){
                var err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            } else {
                res.json(user);
            }
        });
    } else {
        Err = new Error("Fields are missing");
        res.status(400);
        next(err);
    }
})

module.exports = router;