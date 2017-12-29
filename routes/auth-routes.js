const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');


const usersModel = require('../models/users-model');

//Do some routes
router.use(function(req, res, next) {
    console.log("route middleware");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.route('/register')
    .post((req, res) => {
        usersModel.findOne({
                email: req.body.email
            })
            .then((user) => {
                if (user) {
                    res.status(401).json({
                        message: 'User already exists'
                    });
                    return
                }
                //if we are here it means user does not exist
                let newUser = new usersModel();
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.password = bcrypt.hashSync(req.body.password, 10);
                newUser
                    .save()
                    .then((savedUser) => {
                        res.status(200).json({
                            message: 'User saved successfully',
                            data: savedUser
                        })
                    })
                    .catch(() => {
                        res.status(500).json({
                            message: 'User was not saved'
                        });
                    });
            })
            .catch(() => {
                res.status(500).json({
                    message: 'Something has happened'
                });
            })
    });

router.route('/login')
    .post((req, res) => {
        usersModel.findOne({
                email: req.body.email
            })

            .then((user) => {
            	//check if user exists
                if (!user) {
                    res.status(401).json({
                        message: 'User does not exist'
                    });
                    return
                }
                //check if password is correct
                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    res.status(401).json({
                        message: 'Password does not match'
                    });
                    return
                }

                //create token and send it
                let tokenUser = {
                    email: user.email,
                    name: user.name
                }
                const token = jwt.sign(tokenUser, config.secret);
                res.status(200).json({
                    message: 'User logged in successfully',
                    data: {"token": token, "userId": user._id}
                })
            })
            .catch(() => {
                res.status(500).json({
                    message: 'Something has happened'
                });
            })
    });

module.exports = router;