const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../db/db-models');
const { salt, hash } = require('../helpers/hashing');

const db = require('../db/main');
db.init();


router.post('/register', async (req, res, next) => {
    // todo validate
    // todo check user exists
    const password_salt = salt();
    const password_hash = hash(req.body.password, password_salt);
    const client = new models.clients({
        password_hash,
        password_salt,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        name: req.body.name
    });
    await client.save();
    res.json({ auth: true });
    // client.save(function(err) {
    //     if (err) return next(err);
    //     else return req.logIn(user, function(err) {
    //         if (err) return next(err)
    //         else return res.json({ auth: true });
    //     });
    // });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local',
        function(err, _user, info) {
            if (err) {
                next(err);
            } else if (_user) {
                req.logIn(_user, function(err) {
                    return err ? next(err) : res.json({ auth: true });
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