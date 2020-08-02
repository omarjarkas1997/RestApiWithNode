
const User = require('../models/user');

const canAccess = require('../middleware/check-auth');
getUsers = canAccess ,(req, res, next) => {
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
};
exports.getUsers = this.getUsers;