const Client = require('../../database/client')


const profileValidate = require('./profile-validation')
const env = {
    uid: process.env.uid,
    users: process.env.userTable
};

module.exports = {
        fetchProfileQuery : (res, user) => {
        Client.query(`
        with existing as (
        select *
        from poller_data
        where id = ($1)
        ), insert as (
        insert into poller_data (id)
        select ($1)
        where not exists (select 1 from existing)
        returning *)
        select *
        from insert
        union all
        select *
        from existing;`,
        [
        user[`${env.uid}`]
        ],
        function(err, success) {
            if (err) {
                res.status(401).send({response: err})
            }
            if (success) {
                let sendProfile = profileValidate.formatSendProfile(success.rows[0], user)
                res.status(200).send(sendProfile)
            }
        })
    },
    updateProfileQuery: (res,user,profileInfo) => {
        Client.query(`UPDATE ${env.users}
              SET age=($1),
              ethnicity=($2),
              profession=($3),
              religion=($4),
              gender=($5),
              country=($6)
              WHERE id=($7) 
              RETURNING age, ethnicity, profession, religion, gender, country;`,
              [profileInfo.age,
              profileInfo.ethnicity,
              profileInfo.profession,
              profileInfo.religion,
              profileInfo.gender,
              profileInfo.country,
              user[`${env.uid}`],
              ],
              function(err, success) {
                if (success) {
                  let sendProfile = profileValidate.formatSendProfile(success.rows[0], user)
                  res.status(200).send(sendProfile)
                } else {
                  res.status(500).send({message:"unsuccessful updating user profile"})
                }
              })
    }
}