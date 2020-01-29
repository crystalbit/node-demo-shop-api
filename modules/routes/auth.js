const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../db/db-models');
const { salt, hash } = require('../helpers/hashing');
const validateClient = require('../helpers/validateClient');
const validatePassword = require('../helpers/validatePassword');

const Clients = require('../db/clients');

const USER_EXISTS = 'User with this email already exists';
const UNSUITABLE_PASSWORD = 'Select password to be 6 to 16 English/Russian symbols, digits and that stuff: @#$%^&*';

router.post('/register', async (req, res, next) => {
    // validate
    const clientData = {
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        name: req.body.name
    };
    const validator = validateClient(clientData);
    if (validator.email || validator.address || validator.phone || validator.name) {
        return res.json({
            auth: false,
            validator
        });
    }
    // validate password
    if (!validatePassword(req.body.password)) {
        return res.json({
            auth: false,
            validator: {
                password: UNSUITABLE_PASSWORD
            }
        })
    }
    // check user exists
    const finder = await Clients.selectOne({ where: { email: req.body.email }});
    if (finder) {
        return res.json({
            auth: false,
            validator: {
                email: USER_EXISTS
            }
        });
    }
    const password_salt = salt();
    const password_hash = hash(req.body.password, password_salt);
    const client = new models.clients({
        password_hash,
        password_salt,
        ...clientData
    });
    await client.save();
    res.json({ auth: true, client: clientData });
});

router.get('/login', function(req, res) {
    const auth = req.isAuthenticated();
    res.json({
        auth,
        client: {
            email: client.email,
            address: client.address,
            phone: client.phone,
            name: client.name
        }
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local',
        function(err, _user, info) {
            if (err) {
                next(err);
            } else if (_user) {
                req.logIn(_user, function(err) {
                    return err ? next(err) : res.json({
                        auth: true,
                        client: {
                            address: _user.address,
                            name: _user.name,
                            phone: _user.phone,
                            email: _user.email
                        }
                    });
                });
            } else {
                res.json({ auth: false });
            }
        }
    ) (req, res, next);
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.json({ auth: false });
});

module.exports = router;