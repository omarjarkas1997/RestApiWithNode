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
        if(err){
            res.status(err.status);
            return next(err);
        }
        if(users.length == 0){
            var err = new Error("There are no users in the System!");
            res.status(400);
            return next(err);
        }
        users.forEach(user => {
            console.log(user.firstName+" has a password "+user.email);
        });
        res.json(users);
    });
});

// register a new user

router.post('/register', function(req,res,next) {
    const body = req.body;
    console.log(body);
    if( body.firstName &&  body.lastName && 
        body.email && body.password && body.confirmPassword){
            // Making sure we only have unique emails
            User.find({email: req.body.email}).exec()
                .then(user => {
                    // if user exists
                    if(user.length >= 1){
                        // conflict status code
                        var err = new Error('User already exists.');
                        res.status(409);
                        return next(err);
                    }
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
                                message:'User is created successfully!'
                            });
                        }
                    });
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
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
});

// Route for deleting users

router.delete('/:userId', (req, res, next) =>{
    User.deleteOne({id: req.params.id })
        .exec()
            .then(result =>{
                console.log("the result is ",result);
                if(result.deletedCount != 0){
                res.status(200).json({
                    message: 'User was deleted!'
                });
                } else {
                    var err = new Error("Unable to delete user");
                    err.status = 400;
                    res.json({
                        message: err.message
                    });
                }
            }
            ).catch( err => {
                res.status(500).json({
                    error: "Internal Server Error!"
                });
            });
});
module.exports = router;