const Client = require('../../database/client')

const pollValidate = require('./explore-validation')

const env = {
    uid: process.env.uid,
    users: process.env.userTable
};

const exploreValidate = require('./explore-validation')



module.exports = {
    getExploreQueries : (res , user, expirationDate)=> {
        Client.query(`
        SELECT question, subject, author_username, created_at,
                        ($1)-(EXTRACT(day from (now()-date)*24)+EXTRACT(hour from (now()-date)))
                        as expiration,
                        polltype as type,
                        subject,
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
                            then 
                                coalesce(array_length(mc_a_data, 1), 0)
                        end
                        as mc_a_data,
                        case
                            when
                                (($2) = ANY(votes))
                            then coalesce(array_length(mc_b_data, 1), 0)
                        end
                        as mc_b_data,
                        case
                            when
                                (($2) = ANY(votes))
                            then coalesce(array_length(mc_c_data, 1), 0)
                        end
                        as mc_c_data,
                        case
                            when
                                (($2) = ANY(votes))
                            then coalesce(array_length(mc_d_data, 1), 0)
                        end
                        as mc_d_data,
                        mc_a_option,
                        mc_b_option,
                        mc_c_option,
                        mc_d_option
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
                            let results = exploreValidate.formatExploreData(success.rows);
                            res.status(200).send(results)
                        }
                    }
                    if (err) {
                        console.log("ERROR", err)
                        res.status(500).send({error: err})
                    }
                })
        }
}