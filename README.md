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

# Setting up user Authentication and registeration


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








