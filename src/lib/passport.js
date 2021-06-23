const passport = require('passport');
const localStrategy = require('passport-local');
const { query } = require('../database');
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signup', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const {fullname} = req.body
  const newUser = {
    username,
    password,
    fullname
  };
  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO user SET ?', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
  done(null, rows[0]);
});