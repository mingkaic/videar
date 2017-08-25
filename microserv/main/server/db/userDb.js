const passport = require('passport');

var userModel = require('../models/userModel');

exports.getAllUsers = () => {
    return userModel.find({}).exec();
};

exports.getUser = (id) => {
    return userModel.findOne({"_id": id}).exec();
};

exports.setUser = (userInfo) => {
	var username = userInfo.username;
	var password = userInfo.password;

    return new Promise((resolve, reject) => {
        userModel.register(new userModel({ "username": username }),
        password, (err, account) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};

exports.updateUser = (id, userInfo) => {

};

exports.rmUser = (id) => {

};
