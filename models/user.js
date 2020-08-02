'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// pre- save hooks 
// if a function used if you want o modify the data enter before saving it
// ideal for hashin the password before saving it


UserSchema.pre('save', function(next){
    var user = this; // this is the object created in the sign up form
    bcrypt.hash(user.password, 10, function(err,hash){
        if(err){
            return next(err);
        }
        user.password = hash; // overwrite the paintext password with the new password
        next();
    });
});

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
    })
}


var User = mongoose.model('User', UserSchema);

module.exports = User;