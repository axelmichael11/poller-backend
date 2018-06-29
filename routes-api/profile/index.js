// const env = {
//     AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
//     AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
//     AUTH0_CALLBACK_URL:
//       process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
//       users: process.env.userTable,
//       AUTH0_INFO: process.env.AUTH0_INFO,
//       AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
//       userName: process.env.DBuserName,
//       AUTH0_SIGNUP_CALLBACK_URL: process.env.AUTH0_SIGNUP_CALLBACK_URL,
//       AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
//       uid: process.env.uid
//   };

const ProfileRouter = require('express').Router();
const Client = require('../../database/client.js')


const superagent = require('superagent');



const profile = require('./profile-methods');
const checkJwt = require('../../server/checkjwt')

  ProfileRouter.get('/api/user',checkJwt, (req,res) =>profile.fetchProfile(req,res))
  ProfileRouter.put('/api/user', checkJwt, (req, res) => profile.updateProfile(req,res))

  ProfileRouter.delete('/api/user', checkJwt, (req,res) => {
    if (!req.headers.authorization) {
      res.json({message:'no authorization token found!'})
    } else {
      Client.query(`DELETE FROM ${env.users}
        WHERE id=($1);`,
        [uid],
        function(err, success) {
          if (err) res.json({response: err})
          if (success) {
            res.json({data: 'USER DELETED FROM DB'})
          } else {
            res.status(500).json({message:"unsuccessful in putting in data..."})
          }
        }
      )
    }
  })



module.exports = ProfileRouter;