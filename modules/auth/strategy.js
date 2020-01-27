const { hash } = require('../helpers/hashing');
const models = require('../db/db-models');

module.exports = function(passport) {
    const LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            const INCORRECT = 'Incorrect email or password';
            const finder = await models.clients.findOne({ where: { email } });

            if (!finder) {
                return done(null, false, { message: INCORRECT });
            }
            if (finder.password_hash === hash(password, finder.password_salt)) {
                return done(null, finder);
            } else {
                return done(null, false, { message: INCORRECT });
            }
        }
    ));
}
