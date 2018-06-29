


const superagent = require('superagent');
const publicPoll = require('../lib/public-poll-methods.js')
const profile = require('../lib/profile-methods');


  module.exports = (app, client, checkJwt) => {

  app.get('/api/explore', checkJwt, (req,res) => {
    if (!req.headers.authorization || !req.body) {
      res.json({message:'no authorization token  or body found!'})
    } else {
      let token = req.headers.authorization
      profile.getInfo(token)
      .then(user => {
        if (user[`${env.uid}`]) {
          client.query(`
          SELECT question, subject, author_username, created_at
          FROM polls
          ORDER BY random()
          LIMIT 10;
           `,
          function(err, success) {
            if (success){
                if (success.rows[0]){
                 res.status(200).send(success.rows)
                }
                if (success.rows==[]){
                  res.status(200).send(success.rows)
                }
            }
            if (err) {
                res.status(500).send({error: err})
            }
          })
        } else {
          res.json({error:'there was an error identifying you'})
        }
      })
      .catch(err=>{
        res.json({error:err})
      })
    }
  })
}