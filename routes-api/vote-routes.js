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
//       uid: process.env.uid,
//       questions_table: process.env.questions_table,
//   };


const superagent = require('superagent');
const publicPoll = require('../lib/public-poll-methods.js')
const profile = require('../lib/profile-methods');
const vote = require('../lib/votes-methods')

  module.exports = (app, client, checkJwt) => {


    app.post('/api/votes', checkJwt, (req,res) => {
        if (!req.headers.authorization || !req.body) {
          res.json({message:'no authorization token  or body found!'})
        } else {
          let token = req.headers.authorization
          console.log('INFO',req.body)
          let voteData = vote.validateGetVoteData(req.body)
          profile.getInfo(token)
          .then(user => {
            console.log(user[`${env.uid}`])
            if (user[`${env.uid}`]) {
              client.query(`
                SELECT *
                FROM polls
                WHERE author_username=($2) 
                AND created_at=($1) 
                AND ($3) = ANY(yes) 
                OR ($3) = ANY(no);
              `,
              [
                voteData.created_at,
                voteData.author_username,
                user[`${env.uid}`],
              ],
              function(err, success) {
                if (success) {
                  console.log('this is success from db', success, success.rows, success.rowCount)
                  if (success.rows[0]) {
                    res.status(200).send(success.rows[0])
                  }
                  console.log('hitting the 401 here...')
                  res.status(401).send()
                } else {
                  if (err) {
                    console.log('err.name', err)
                    res.status(500).send({error: err})
                  }
                }
              })
            } else {
              res.json({error:'there was an error identifying you'})
            }
          })
          .catch(err=>{
            console.log('no user found sdfsdfsdfsdfsd', err )
            res.json({error:err})
          })
          // console.log('this is the validated poll', validatedPoll)
        }
      })


      app.post('/api/postvotes', checkJwt, (req,res) => {
        if (!req.headers.authorization || !req.body) {
          res.json({message:'no authorization token  or body found!'})
        } else {
          let token = req.headers.authorization
          let voteData = vote.validatePostVoteData(req.body)
          profile.getInfo(token)
          .then(user => {
            console.log(user[`${env.uid}`])
            if (user[`${env.uid}`]) {
              client.query(`
                INSERT INTO polls
                WHERE author_username=($2) 
                AND created_at=($1) 
                AND ($3) = ANY(yes) 
                OR ($3) = ANY(no);
              `,
              [
                voteData.created_at,
                voteData.author_username,
                user[`${env.uid}`],
              ],
              function(err, success) {
                if (success) {
                  console.log('this is success from db', success, success.rows, success.rowCount)
                  if (success.rows[0]) {
                    res.status(200).send(success.rows[0])
                  }
                  console.log('hitting the 401 here...')
                  res.status(401).send()
                } else {
                  if (err) {
                    console.log('err.name', err)
                    res.status(500).send({error: err})
                  }
                }
              })
            } else {
              res.json({error:'there was an error identifying you'})
            }
          })
          .catch(err=>{
            console.log('no user found sdfsdfsdfsdfsd', err )
            res.json({error:err})
          })
          // console.log('this is the validated poll', validatedPoll)
        }
      })


  }
