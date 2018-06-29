//imports
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');
const path = require('path');
// connpmst process = require('process');
const app = express();

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

//app is using...
app.use(logger('dev'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Handle auth failure error messages
app.use(function(req, res, next) {
  if (req && req.query && req.query.error) {
    req.flash("error", req.query.error);
  }
  if (req && req.query && req.query.error_description) {
    req.flash("error_description", req.query.error_description);
  }
  next();
 });

//client pg variables
const connectionString = process.env.DATABASE_URI;
const client = new pg.Client({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DB,
  port: process.env.DBPORT,
  host: process.env.DBHOST,
  ssl: true
});


//auth0 combined with passport
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

//ROUTES
require('../routes/index.js')(app, passport, client)
require('../routes/user.js')(app, client)

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});




// require('./server/routes')(app);
// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to the beginning of nothingness.',
// }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});



const state = {
  isOn: false, 
  http: null,
}

const server = {};

server.start = () => {
  // const client = new pg.Client(process.env.DATABASE_URI);
  return new Promise((resolve, reject) => {
    // console.log('this is hte client!', client);
    if (state.isOn) 
        return reject(new Error('USAGE ERROR: the state is on'))
    state.isOn = true
    // console.log('this is the client database', client)
    return client.connect()
    .then(() => {
      state.http = app.listen(process.env.PORT, () => {
        console.log('__SERVER_UP__', process.env.PORT)
        resolve()
      })
    })
    .catch((error)=>{
      console.log('this is the erroer!',error)
    })
  })
}



module.exports = server;
