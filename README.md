# RestApiWithNode

## First Steps
#### Setting up the enviroment and installing dependencies

First Dependencies are:

Initializing a project with npm:

                    npm install init -y

Installing express framework for the RestApi:

                    npm install express --save

Installing mongoose ORM to communication with MongoDB:
                    
                    npm install mongoose -save

Installing morgan to log the http request of the Api:
                    
                    npm install morgan --save

Installing bady parser to be able to read the body of the http request:
                    
                    npm install body-parser --save

Set up the **app.js** file by requiring the modules installed and running the express app on port 3000.

# Setting up user Authentication and registration


Registering a new user

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

Authenticating a user:

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
###### Using bcrypt to hash password

Bcrypt: [link](https://github.com/kelektiv/node.bcrypt.js)

        // authenticate input against database document
        UserSchema.statics.authenticate = function(email,password,callback){
            // return the user with the specific address
            User.findOne({email: email}).exec(function(error,user){
                if (error){
                    return callback(error);
                } else if(!user){
                    var err = new Error('User not found!');
                    err.status = 401;
                    return callback(err);
                }
                // compares the user with the password entered 
                bcrypt.compare(password, user.password, function(error,result){
                    if (result === true){
                        return callback(null,user);
                    }else {
                        return callback();
                    }
                });
            }

# Using JWT to Authenticate users

First install jwt using npm


                npm install jsonwebtoken --save


In the folder where you want to use it

                const jwt = require('jsonwebtoken');    

Use **jwt.sign** sign method to return the token to the server after authentication.

            router.get('/login', (req, res) => {
                if( req.body.email && req.body.password){
                    User.authenticate(req.body.email, req.body.password, function(error, user){
                        if(error || !user){
                            var err = new Error('Wrong email or password');
                            err.status = 401;
                            res.json({
                                message: err.message
                            });
                        } else {
                            // JWT goes here
                            console.log(process.env.JWT_KEY);
                            const token = jwt.sign({
                                id: user._id,
                                email: user.email,
                            }, process.env.JWT_KEY, {
                                expiresIn: "1h"
                            });
                            return res.json({
                                user: user,
                                token: token
                            });
                        }
                        
                    });
                } else {
                    Err = new Error("Fields are missing");
                    res.status(400);
                    next(err);
                }
            });



#### Verifying tokens and protecting routes

Using **jwt.verify** method:
Make sure to put the token recieved by the response in the header of postman.
Create a new files.

                const { verify } = require("jsonwebtoken");

                const jwt = require('jsonwebtoken');

                verifyToken = (req, res, next) => {
                    try{
                        const token = req.headers.authorization.split(" ")[1];
                        console.log("The token is ", token);
                        const decoded = jwt.verify(token, process.env.JWT_KEY);
                        req.userData = decoded;
                    }catch (err){
                        return res.status(401).json({
                            message: 'Auth Failed'
                        });
                    }
                    next();
                }


                module.exports = verifyToken;

## Disable CORS in our Rest API

Use this in the **app.js**
            app.use((req,res,next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header(
                    'Access-Control-Allow-Headers',
                    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                
                if(req.method === 'OPTIONS') {
                    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
                    return res.status(200).json({});
                }
                next();
            });


#  
