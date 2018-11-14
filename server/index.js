const express = require('express');
const app = express();
const pg = require('pg');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

//app is using...
app.use(morgan('dev'));
app.use(cors({
//  "Access-Control-Allow-Origin": process.env.ORIGIN,
  origin:process.env.ORIGIN, 
  // 'Access-Control-Allow-Methods':'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  preflightContinue: true,
  allowedHeaders:['Authorization', 'Content-Type','Content-Length', 'X-Requested-With']
  // "access-control-allow-headers" : "Content-Type, Authorization, Content-Length, X-Requested-With",
  // "access-control-allow-methods" :"GET,PUT,POST,DELETE,OPTIONS",
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const checkJwt = require('./checkjwt')

const checkScopes = jwtAuthz(['read:messages']);



const Client = require('../database/client.js')







//ROUTES
app.use(require('../routes-api/profile'));
app.use(require('../routes-api/poll'));
app.use(require('../routes-api/explore'));
app.use(require('../routes-api/vote'));
app.use(require('../routes-api/report'));
app.use(require('../routes-api/feedback'));


//CRON JOBS
// const updatePollTask = require('../database/cron-jobs').updatePolls; POLLS ARE NOT DELETED
const deleteReportedPolls = require('../database/cron-jobs').deleteReportedPolls;

//CRON JOBS ON
deleteReportedPolls.start();
// updatePollTask.start();

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

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
      return Client.connect()
      .then(() => {
        state.http = app.listen(process.env.PORT || '3000', () => {
          console.log('__SERVER_UP__', process.env.PORT)
          resolve()
        })
      })
      .catch((error)=>{
        console.log('this is the erroer!',error)
      })
    })
  }
  

  server.stop = () => {
    return new Promise((resolve, reject) => {
      if (!state.isOn) return reject(new Error('USAGE ERROR: the state is off'))
      return Client.end()
        .then(() => {
          state.http.close(() => {
            console.log('__SERVER_DOWN__')
            state.isOn = false
            state.http = null
            resolve()
          })
        })
        .catch(reject)
    })
  }
  
  
  module.exports = server;