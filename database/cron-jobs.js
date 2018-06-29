const CronJob = require('cron').CronJob;

const Client = require('./client')


module.exports = {
    updatePolls: new CronJob({
        cronTime:'* 0 0-23 * * 0-7', 
        onTick: function(){
            Client.query(`
                with polls_to_delete as (
                    select array(select id from polls where date < (now() - interval '3 DAY')) as polls, author_id 
                    from polls 
                    group by author_id
                ),
                deleted as ( delete from polls where date < (now() - interval '3 DAY'))
                update poller_data set polls_id = array_subtract(polls_id, polls_to_delete.polls) 
                from polls_to_delete
                where poller_data.id=polls_to_delete.author_id;
                `,
                function(err, success) {
                    if (err) {
                        console.log('error from database', err)
                    }
                    if (success) {
                        console.log('CRON JOB DELETE OLD POLLS past 3 days', success)
                    }
                }
            )
        },
        start:false,
        timeZone:'America/Los_Angeles'
    }),
    deleteReportedPolls: new CronJob({
        cronTime:'* 0 12 * * 0-7', 
        onTick: function(){
        Client.query(`
        with polls_to_delete as (
            select array(select id from polls where cardinality(report) > 9) as polls, author_id 
            from polls 
            group by author_id
        ),
        deleted as ( delete from polls where cardinality(report) > 9)

        update poller_data set polls_id = array_subtract(polls_id, polls_to_delete.polls) 
        from polls_to_delete
        where poller_data.id=polls_to_delete.author_id;
            `,
            function(err, success) {
                if (err) {
                    console.log('error from database', err)
                }
                if (success) {
                    console.log('this is the db DELETE REPORTED POLLS', success)
                }
            }
        )
    },
    start:false,
    timeZone:'America/Los_Angeles'
    }),
        
    
}