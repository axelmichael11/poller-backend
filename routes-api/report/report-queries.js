const Client = require('../../database/client')

const reportValidation = require('./report-validation')

const env = {
    uid: process.env.uid,
    users: process.env.userTable
};




module.exports = {

  reportPoll : (res, user, reportData)=> {

    Client.query(`
      UPDATE polls 
      SET report = array_append(report, ($1)) 
      WHERE polls.author_username=($3)
      AND polls.created_at=($2)
      RETURNING *;     
      `,
      [
      user[`${env.uid}`],
      reportData.created_at,
      reportData.author_username,
      ],
      function(err, success) {
        if (success) {
          res.status(200).send({message: 'poll has been reported'})
        } else {
          if (err) {
            res.status(500).send({error: err})
          }
        }
      })
  },
}