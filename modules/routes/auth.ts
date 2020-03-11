import express from 'express';
import passport from 'passport';

import { salt, hash } from '../helpers/hashing';
import validateClient from '../helpers/validateClient';
import validatePassword from '../helpers/validatePassword';
import { add as addClient, selectOne as selectOneClient } from '../db/clients';

const router = express.Router();

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
    const finder = await selectOneClient({ where: { email: req.body.email }});
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
    const client = await addClient({
        password_hash,
        password_salt,
        ...clientData
    });
    await new Promise(rs => req.logIn(client, rs));
    res.json({ auth: true, client: clientData });
});

router.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
        res.json({
            auth: true,
            client: {
                email: req.user ? req.user.email : '',
                address: req.user ? req.user.address : '',
                phone: req.user ? req.user.phone : '',
                name: req.user ? req.user.name : ''
            }
        });
    } else {
        res.json({ auth: false });
    }
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local',
        function(err, _user) {
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

export default router;
