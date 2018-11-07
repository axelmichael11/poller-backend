const Client = require('../../database/client')

const pollValidate = require('./explore-validation')

const env = {
    uid: process.env.uid,
    users: process.env.userTable
};




module.exports = {
    getExploreQueries : (res , user, expirationDate)=> {
        Client.query(`
        SELECT question, subject, author_username, created_at,
                        ($1)-(EXTRACT(day from (now()-date)*24)+EXTRACT(hour from (now()-date)))
                        as expiration,
                        polltype as type,
                        case
                            when
                                (($2) = ANY(votes))
                            then 'true'
                            else 'false'
                        end
                        as voted,
                        case
                            when
                                (($2) = ANY(votes))
                            then mc_a_data
                        end
                        as mc_a_data,
                        case
                            when
                                (($2) = ANY(votes))
                            then mc_b_data
                        end
                        as mc_b_data,
                        case
                            when
                                (($2) = ANY(votes))
                            then mc_c_data
                        end
                        as mc_c_data,
                        case
                            when
                                (($2) = ANY(votes))
                            then mc_d_data
                        end
                        as mc_d_data
                        FROM polls
                        ORDER BY random()
                        LIMIT 20;
                `,
                [
                    expirationDate,
                    user[`${env.uid}`],
                ],
                function(err, success) {
                    if (success){
                        if (success.rows){
                            console.log('RESULTS', success.rows)
                            res.status(200).send(success.rows)
                        }
                    }
                    if (err) {
                        console.log("ERROR", err)
                        res.status(500).send({error: err})
                    }
                })
        }
}


// SELECT question, subject, author_username, created_at,
//                 ($1)-(EXTRACT(day from (now()-date)*24)+EXTRACT(hour from (now()-date)))
//                 as expiration,
//                     case when EXISTS (select ($2) = ANY(votes) from polls)
//                     then
//                     'true'
//                     else
//                     'false'
//                     end as already_answered, 
//                 polltype as type
//                 FROM polls
//                 ORDER BY random()
//                 LIMIT 20;


// (case when EXISTS (select 1 from polls where ($2) = ANY(votes))
//                 then
//                 mc_a_option
//                 end), 


// (case when EXISTS (select 1 from polls where ($2) = ANY(votes) AND polls.created_at = created_at)