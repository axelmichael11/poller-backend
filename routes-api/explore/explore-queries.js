const Client = require('../../database/client')

const pollValidate = require('./explore-validation')

const env = {
    uid: process.env.uid,
    users: process.env.userTable
};




module.exports = {
    getExploreQueries : (res ,expirationDate)=> {
        Client.query(`
                SELECT question, subject, author_username, created_at, 
                (($1)-EXTRACT(hour from (now() - date))) as expiration
                FROM polls
                ORDER BY random()
                LIMIT 20;
                `,
                [expirationDate],
                function(err, success) {
                    if (success){
                        if (success.rows){
                        res.status(200).send(success.rows)
                        }
                    }
                    if (err) {
                        res.status(500).send({error: err})
                    }
                })
        }
}