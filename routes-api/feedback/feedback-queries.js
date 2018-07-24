const Client = require('../../database/client')

const env = {
    uid: process.env.uid,
    users: process.env.userTable
};




module.exports = {

  submitFeedBack : (res, user, feedBackData)=> {
    Client.query(`
    WITH feedback AS (INSERT INTO feedback (author_id, comments)
        VALUES ($1, $2) RETURNING author_id, comments)
        UPDATE poller_data SET feedback_id = array_append(feedback_id, feedback.author_id) 
        FROM feedback WHERE poller_data.id=feedback.author_id
        RETURNING feedback.comments;
      `,
      [
        user[`${env.uid}`],
        feedBackData.feedBack,
      ],
      function(err, success) {
        if (success && success.command==='UPDATE' && success.rowCount== 1) {
          console.log('SUCCESS', success)
            res.status(200).json(success.rows[0])
        } else {
            if (err.name =='error' && err.constraint=='feedback_id_check') {
              console.log('FAIL 550', err)
                res.status(550).send({error: err.name})
            } else {
              console.log('FAIL unknown', err)
                res.status(500).send('unknown error')
            }
        }
      })
  },
}