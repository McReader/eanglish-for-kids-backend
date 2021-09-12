const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const { BasicStrategy } = require('passport-http');

const { ADMIN_USER_USERNAME, ADMIN_USER_PASSWORD } = process.env

const adminUser = { id: ADMIN_USER_USERNAME, username: ADMIN_USER_USERNAME };

const auth = (username, password, done) => {
  if (username !== ADMIN_USER_USERNAME) {
    return done(null, false, { message: 'Incorrect username.' });
  }
  if (password !== ADMIN_USER_PASSWORD) {
    return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, adminUser);
};

passport.use(new LocalStrategy(auth));
passport.use(new BasicStrategy(auth));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, adminUser);
});

module.exports = passport;
