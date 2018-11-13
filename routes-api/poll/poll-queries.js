const Client = require('../../database/client')

const pollValidate = require('./poll-validation')

const env = {
    uid: process.env.uid,
};




module.exports = {
    postPoll: function(res,user, validatedPoll){
        let answerColumns = this.insertAnswerOptionsStatement(validatedPoll.answerOptions)
        let answerValues = this.insertAnswerOptionsValuesStatement(validatedPoll.answerOptions)
        Client.query(`
        WITH poll AS (INSERT INTO polls (
            author_id, 
            author_username, subject, 
            question, 
            polltype,
            ${answerColumns})
        VALUES ($1, $2, $3, $4, $5, ${answerValues}) RETURNING 
        created_at, 
        id, 
        author_id, 
        subject, 
        question, 
        author_username,
        mc_a_option,
        mc_b_option, 
        mc_c_option, 
        mc_d_option, 
        mc_a_data,
        mc_b_data,
        mc_c_data,
        mc_d_data
        )
        UPDATE poller_data SET polls_id = array_append(polls_id, poll.id) 
        FROM poll WHERE poller_data.id=poll.author_id
        RETURNING poll.author_username,
        poll.created_at, 
        poll.subject, 
        poll.question,
        poll.mc_a_option,
        poll.mc_b_option, 
        poll.mc_c_option, 
        poll.mc_d_option, 
        poll.mc_a_data,
        poll.mc_b_data,
        poll.mc_c_data,
        poll.mc_d_data
        ;
        `,
        [user[`${env.uid}`],
        validatedPoll.nickname,
        validatedPoll.pollSubject,
        validatedPoll.pollQuestion,
        validatedPoll.type,
        ...validatedPoll.answerOptions,
        ],
        function(err, success) {
        if (success && success.command==='UPDATE' && success.rowCount== 1) {
            console.log('SUCCESS #*$&%#($%&#($', success.rows)
            let userPollDataToSend = pollValidate.formatUserPollsData(success.rows)
            console.log("FORMATTED DATA", userPollDataToSend[0])
            res.status(200).json(userPollDataToSend[0])
        } else {
            if (err.name =='error' && err.constraint=='polls_id_check') {
                console.log('err', err)
                res.status(550).send({error: err.name})
            } else {
                console.log('err', err)
                res.status(500).send('unknown error')
            }
        }
        })
    },

    insertAnswerOptionsStatement: function(answerOptions){
        if (answerOptions.length == 2){
            return 'mc_a_option, mc_b_option'
        }
        if (answerOptions.length == 3){
            return 'mc_a_option, mc_b_option, mc_c_option'
        }
        if (answerOptions.length == 4){
            return 'mc_a_option, mc_b_option, mc_c_option, mc_d_option'
        }
    },

    insertAnswerOptionsValuesStatement: function(answerOptions){
        if (answerOptions.length == 2){
            console.log('HITTING 2')
            return ' $6, $7'
        }
        if (answerOptions.length == 3){
            console.log('HITTING 3')
            return ' $6, $7, $8'
        }
        if (answerOptions.length == 4){
            console.log('HITTING 4')
            return ' $6, $7, $8, $9'
        }
    },


    insertMultipleChoiceOptions: function(answerOptions){
        if (answerOptions.length==2){

        }

    },


    deletePollQuery : (res, user, validatedPoll) => {
        Client.query(`
        WITH poll AS (
        DELETE FROM polls WHERE created_at=($2) AND author_id=($1)
        RETURNING id, author_id, created_at
        )
        UPDATE poller_data SET polls_id = array_remove(polls_id, poll.id) from poll WHERE poller_data.id=poll.author_id
        RETURNING poll.created_at;`,
        [user[`${env.uid}`],
        validatedPoll.created_at,
        ],
        function(err, success) {
        if (success) {
            if (success.rows[0]){
            let pollToDelete = pollValidate.formatPollDeleteSend(success.rows[0])
            res.status(200).json(pollToDelete)
            }
            if (success.rowCount==0){
            res.status(404).json({message:'poll was not found'})
            } 
        } 
        else {
            if (err.name =='error') {
            res.status(500).send('unknown error')
            }
        }
        })
    },
    getPollsQuery: (res,user, expirationDate)=>{
        Client.query(`
        SELECT question, subject, author_username, created_at,
        ($2)-(EXTRACT(day from (now()-date)*24)+EXTRACT(hour from (now()-date))) 
        as expiration,
        polltype as type,
        case
                            when
                                (($1) = ANY(votes))
                            then 'true'
                            else 'false'
                        end
                        as voted,
                        case
                            when
                                (($1) = ANY(votes))
                            then 
                                coalesce(array_length(mc_a_data, 1), 0)
                        end
                        as mc_a_data,
                        case
                            when
                                (($1) = ANY(votes))
                            then coalesce(array_length(mc_b_data, 1), 0)
                        end
                        as mc_b_data,
                        case
                            when
                                (($1) = ANY(votes))
                            then coalesce(array_length(mc_c_data, 1), 0)
                        end
                        as mc_c_data,
                        case
                            when
                                (($1) = ANY(votes))
                            then coalesce(array_length(mc_d_data, 1), 0)
                        end
                        as mc_d_data,
        mc_a_option,
        mc_b_option,
        mc_c_option,
        mc_d_option
        from polls WHERE author_id=($1)
         `,
        [
          user[`${env.uid}`],
          expirationDate,
        ],
        function(err, success) {
          if (success) {
              console.log("SUCCESS", success.rows)
              let formattedResults = pollValidate.formatUserPollsData(success.rows);
            res.status(200).send(formattedResults)
          } else {
            if (err) {
                console.log('ERROR', err)
              res.status(500).send({error: err})
            }
          }
        })
    }
}