const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = function(passport, user) {
    const User = user;
    const LocalStrategy = require('passport-local').Strategy;
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            const generateHash = password => bcrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            
        }
    ));
}
