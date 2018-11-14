const Client = require('../../database/client')

const vollValidate = require('./vote-validation')

const env = {
    uid: process.env.uid,
    users: process.env.userTable
};


module.exports = {
  checkIfVoted: (user, voteData) =>{
    Client.query(`       
                SELECT polltype as type
                FROM polls
                WHERE author_username=($2) 
                AND created_at=($1) 
                AND ($3) = ANY(votes)
                GROUP BY polls.array_yes_data, polls.array_no_data, polls.polltype, cardinality(polls.votes);
                `,
              [
                voteData.created_at,
                voteData.author_username,
                user[`${env.uid}`],
              ],
              function(err, success) {
                if (success) {
                  console.log('this is success from db', success)
                  if (success.rows[0]) {
                      let data = vollValidate.YNformatSendData(success.rows[0])
                    res.status(200).send(data)
                  }
                    res.status(401).send()
                } else {
                  if (err) {
                    console.log('err.name', err)
                    res.status(500).send({error: err})
                  }
                }
              })
  },
  YNgetVotes : (res, user, voteData)=> {
        Client.query(`       
                SELECT cardinality(votes) as count, array_yes_data, array_no_data, polltype as type
                FROM polls
                WHERE author_username=($2) 
                AND created_at=($1) 
                AND ($3) = ANY(votes)
                GROUP BY polls.array_yes_data, polls.array_no_data, polls.polltype, cardinality(polls.votes);
                `,
              [
                voteData.created_at,
                voteData.author_username,
                user[`${env.uid}`],
              ],
              function(err, success) {
                if (success) {
                  console.log('this is success from db', success)
                  if (success.rows[0]) {
                      let data = vollValidate.YNformatSendData(success.rows[0])
                    res.status(200).send(data)
                  }
                    res.status(401).send()
                } else {
                  if (err) {
                    console.log('err.name', err)
                    res.status(500).send({error: err})
                  }
                }
              })
        },
        NEWYNgetVotes:(res, user, voteData)=> {
          Client.query(`       
                  SELECT cardinality(votes) as count,
                  polls.author_username,
                  polls.question,
                  polls.mc_a_option,
                  polls.mc_b_option,
                  polls.mc_a_data,
                  polls.mc_b_data,
                  polltype as type
                  FROM polls
                  WHERE author_username=($2) 
                  AND created_at=($1) 
                  AND ($3) = ANY(votes)
                  GROUP BY 
                  polls.author_username,
                  polls.question,
                  polls.mc_a_option,
                  polls.mc_b_option,
                  polls.mc_a_data,
                  polls.mc_b_data,
                  polls.polltype,
                  cardinality(polls.votes);
                  `,
                [
                  voteData.created_at,
                  voteData.author_username,
                  user[`${env.uid}`],
                ],
                function(err, success) {
                  if (success) {
                    console.log('this is success from db', success)
                    if (success.rows[0]) {
                        let data = vollValidate.YNformatSendData(success.rows[0])
                      res.status(200).send(data)
                    }
                      res.status(401).send()
                  } else {
                    if (err) {
                      console.log('err.name', err)
                      res.status(500).send({error: err})
                    }
                  }
                })
          },

        MCgetVotes : (res, user, voteData)=> {
          Client.query(`       
                  SELECT cardinality(votes) as count,
                  polls.author_username,
                  polls.question,
                  polls.mc_a_option,
                  polls.mc_b_option,
                  polls.mc_c_option,
                  polls.mc_d_option,
                  polls.mc_a_data,
                  polls.mc_b_data,
                  polls.mc_c_data,
                  polls.mc_d_data,
                  polltype as type
                  FROM polls
                  WHERE author_username=($2) 
                  AND created_at=($1) 
                  AND ($3) = ANY(votes)
                  GROUP BY 
                  polls.author_username,
                  polls.question,
                  polls.mc_a_option,
                  polls.mc_b_option,
                  polls.mc_c_option,
                  polls.mc_d_option,
                  polls.mc_a_data,
                  polls.mc_b_data,
                  polls.mc_c_data,
                  polls.mc_d_data,
                  polls.polltype,
                  cardinality(polls.votes);
                  `,
                [
                  voteData.created_at,
                  voteData.author_username,
                  user[`${env.uid}`],
                ],
                function(err, success) {
                  if (success) {
                    console.log('this is success from db', success)
                    if (success.rows[0]) {
                        let data = vollValidate.MCformatSendData(success.rows[0])
                      res.status(200).send(data)
                    }
                      res.status(401).send()
                  } else {
                    if (err) {
                      console.log('err.name', err)
                      res.status(500).send({error: err})
                    }
                  }
                })
          },
          NEWYNcastVote:function(res, user, voteData){
            // console.log('THIS', this)
            let voteColumn = this.determineYNVoteColumn(voteData.vote);
            Client.query(`
            UPDATE polls 
            SET ${voteColumn} = ${voteColumn} || ARRAY[[($1),($2),($3),($4),($5),($6),($7)]],
            votes = array_append(votes, ($8))
            WHERE polls.author_username=($9)
            AND polls.created_at=($10) 
            RETURNING
            polls.author_username,
            polls.mc_a_option,
            polls.mc_b_option,
            polls.mc_c_option,
            polls.mc_d_option,
            polls.mc_a_data,
            polls.mc_b_data,
            polls.mc_c_data,
            polls.mc_d_data,
            polls.question,
            cardinality(votes) as count;
          `,
          [
            voteData.age,
            voteData.country,
            voteData.ethnicity,
            voteData.profession,
            voteData.gender,
            voteData.religion,
            voteData.politics,
            user[`${env.uid}`],
            voteData.author_username,
            voteData.created_at,
          ],
          function(err, success) {
            if (success) {
              console.log('this is success from db', (success.rows.length> 0), success.rowCount)
              if (success.rows.length >0) {
                let data = vollValidate.MCformatSendData(success.rows[0])
                console.log('DATA SUCCESS', data)
                res.status(200).send(data)
              }else {
                res.status(404).send('no poll was found! this was deleted previously')
              }
            } else {
              if (err) {
                console.log('err.name when casting vote', err)
                res.status(500).send({error: err})
              }
            }
          })
        },
        determineYNVoteColumn: function(vote){
          if (vote=='Yes'){
            return 'mc_a_data'          
          }
          if (vote=='No'){
            return 'mc_b_data'          
          }
        },

        YNcastVote : function(res, user, voteData){
            let data = JSON.stringify(voteData)
            console.log
            if (voteData.vote==='Yes'){
                castYesVote(res,user,voteData)
            }
            if (voteData.vote==='No'){
                castNoVote(res,user,voteData)
            }
            if (!voteData.vote==='yes'||!voteData.vote==='no'){
                res.status(401).send('you dont seem to have a yes or no vote...')
            }
        },

        MCcastVote : function(res, user, voteData){

          let voteColumn = this.determineMCVoteColumn(voteData.vote);
          console.log('VOTE COLUMNNN', voteColumn)
          Client.query(`
          UPDATE polls 
          SET ${voteColumn} = ${voteColumn} || ARRAY[[($1),($2),($3),($4),($5),($6),($7)]],
          votes = array_append(votes, ($8))
          WHERE polls.author_username=($9)
          AND polls.created_at=($10) 
          RETURNING
          polls.author_username,
          polls.mc_a_option,
          polls.mc_b_option,
          polls.mc_c_option,
          polls.mc_d_option,
          polls.mc_a_data,
          polls.mc_b_data,
          polls.mc_c_data,
          polls.mc_d_data,
          polls.question,
          cardinality(votes) as count;
        `,
        [
          voteData.age,
          voteData.country,
          voteData.ethnicity,
          voteData.profession,
          voteData.gender,
          voteData.religion,
          voteData.politics,
          user[`${env.uid}`],
          voteData.author_username,
          voteData.created_at,
        ],
        function(err, success) {
          if (success) {
            console.log('this is success from db', (success.rows.length> 0), success.rowCount)
            if (success.rows.length >0) {
              let data = vollValidate.MCformatSendData(success.rows[0])
              console.log('DATA SUCCESS', data)
              res.status(200).send(data)
            }else {
              res.status(404).send('no poll was found! this was deleted previously')
            }
          } else {
            if (err) {
              console.log('err.name when casting vote', err)
              res.status(500).send({error: err})
            }
          }
        })
      },
      
      determineMCVoteColumn: function (vote){
        console.log('HITTING VOTE COLUMN', vote)
        if (vote=='A'){
          return 'mc_a_data'          
        }
        if (vote=='B'){
          return 'mc_b_data'          
        }
        if (vote=='C'){
          return 'mc_c_data'          
        }
        if (vote=='D'){
          return 'mc_d_data'          
        }
      }
}

castNoVote = (res,user,voteData)=>{
    Client.query(`
    UPDATE polls 
    SET array_no_data = array_no_data || ARRAY[[($1),($2),($3),($4),($5),($6),($7)]],
    votes = array_append(votes, ($8))
    WHERE polls.author_username=($9)
    AND polls.created_at=($10) 
    RETURNING polls.array_yes_data, polls.array_no_data, cardinality(votes) as count;
  `,
  [
    voteData.age,
    voteData.country,
    voteData.ethnicity,
    voteData.profession,
    voteData.gender,
    voteData.religion,
    voteData.politics,
    user[`${env.uid}`],
    voteData.author_username,
    voteData.created_at,
  ],
  function(err, success) {
    if (success) {
      console.log('this is success from db', (success.rows.length> 0), success.rowCount)
      if (success.rows.length >0) {
        let data = vollValidate.YNformatSendData(success.rows[0])
        res.status(200).send(data)
      }else {
        res.status(404).send('no poll was found! this was deleted previously')
      }
    } else {
      if (err) {
        console.log('err.name', err)
        res.status(500).send({error: err})
      }
    }
  })

}

castYesVote = (res,user,voteData)=>{
    Client.query(`
                UPDATE polls 
                SET array_yes_data = array_yes_data || ARRAY[[($1),($2),($3),($4),($5),($6),($7)]],
                votes = array_append(votes, ($8))
                WHERE polls.author_username=($9)
                AND polls.created_at=($10) 
                RETURNING polls.array_yes_data, polls.array_no_data, cardinality(votes) as count;
              `,
              [
                voteData.age,
                voteData.country,
                voteData.ethnicity,
                voteData.profession,
                voteData.gender,
                voteData.religion,
                voteData.politics,
                user[`${env.uid}`],
                voteData.author_username,
                voteData.created_at,
              ],
              function(err, success) {
                if (success) {
                  console.log('this is success from db', success, (success.rows.length> 0), success.rows[0])
                  if (success.rows.length >0) {
                    let data = vollValidate.YNformatSendData(success.rows[0].array_yes_data, success.rows[0].array_no_data, success.rows[0].count)
                    res.status(200).send(data)
                  }else {
                    res.status(404).send('no poll was found! this was deleted previously')
                  }
                } else {
                  if (err) {
                    console.log('err.name', err)
                    res.status(500).send({error: err})
                  }
                }
              })
}
