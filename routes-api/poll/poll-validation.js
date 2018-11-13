
const subjects_list = require('./poll-subjects.js')

const randomColor = require('randomcolor')

module.exports = {
    userPollValidate : function(incomingPoll){
        let {nickname, pollQuestion, pollSubject, answerOptions, type} = incomingPoll;
        let poll = Object.assign({},{nickname, pollQuestion, pollSubject, answerOptions, type});
        console.log('poll!!!', poll, (poll.type!=='MC' || poll.type!=='YN') ) 
        if (!poll.nickname || poll.nickname.length > 20 || typeof poll.nickname !== 'string'){
            throw new Error('invalid nickname type or length, or nonexistant property');
        }
        if ( typeof poll.pollSubject !== 'number' ){
            throw new Error('invalid subject type, or nonexistant property');
        }
        if (!poll.pollQuestion || poll.pollQuestion.length < 10 || typeof poll.pollQuestion !== 'string'){
            throw new Error('invalid question type or length, or nonexistant property');
        }

        if (!poll.type || poll.type.length > 3 || typeof poll.type !== 'string'){
            throw new Error('invalid type type or length, or nonexistant property');
        }

        if ( poll.type=='MC' && !poll.answerOptions && poll.answerOptions.length < 2 ){
            throw new Error('invalid MC options, or nonexistant property');
        }

        if ( poll.type=='YN' && !poll.answerOptions){
            throw new Error('invalid YN options, or nonexistant property');
        }

        return poll
    },



    deletePollValidate : function(incomingPoll){
        let {created_at} = incomingPoll;
        
        let poll = Object.assign({},{created_at});
        if (!poll.created_at || typeof poll.created_at !== 'string'){
          throw new Error('invalid incomingPoll type or length, or nonexistant property');
        }
        return poll;
      },

      formatPollDeleteSend : function(queryResult){
        let {created_at} = queryResult;
        let deletedPoll = Object.assign({},{created_at});
        if (!deletedPoll.created_at || typeof deletedPoll.created_at !== 'string'){
          throw new Error('invalid poll type or length, or nonexistant property');
        }
        
        return deletedPoll;
      },

formatUserPollsData : function(userPollDataArray){
    let formattedExploreData = userPollDataArray.map(pollData=>{
            let exploreResults = this.formatUserPoll(pollData)
            return exploreResults
    })
    return formattedExploreData
},

formatUserPoll : function(pollData){
    let pollResults = {};
    pollResults.question = pollData.question;
    pollResults.subject = pollData.subject;
    pollResults.author_username = pollData.author_username;
    pollResults.created_at = pollData.created_at;
    // pollResults.expiration = pollData.expiration;
    pollResults.type = pollData.type;
    pollResults.categories = {};
    if (pollData.mc_a_option){
        pollResults.categories['A'] = pollData.mc_a_option
    }
    if (pollData.mc_b_option){
        pollResults.categories['B'] = pollData.mc_b_option
    }
    if (pollData.mc_c_option){
        pollResults.categories['C'] = pollData.mc_c_option
    }
    if (pollData.mc_d_option){
        pollResults.categories['D'] = pollData.mc_d_option
    }
    
    if (pollData.voted == 'true'){
        pollResults.quickTotals = this.formatQuickTotals(pollData)
    }
    return pollResults;
},

formatQuickTotals : function(pollData){
    let quickTotals = {}
    let voteTotals = Object.keys(pollData).reduce((acc, curr)=>{
        if (curr.indexOf('data')>= 0){
            acc = acc+pollData[curr]
            return acc;
        } else {
            return acc;        
        }
    }, 0)
    quickTotals.title= 'Total Votes'
    quickTotals.data = [];
    quickTotals.categories = {};
    if (pollData.mc_a_option){
        quickTotals.categories['A'] = pollData.mc_a_option
        let a_data = {
            id:'A',
            y: this.formatQuickTotalPercent(pollData.mc_a_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, a_data]
    }

    if (pollData.mc_b_option){
        quickTotals.categories['B'] = pollData.mc_b_option
        let b_data = {
            id:'B',
            y: this.formatQuickTotalPercent(pollData.mc_b_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, b_data]
    }
    if (pollData.mc_c_option){
        quickTotals.categories['C'] = pollData.mc_c_option
        let c_data = {
            id:'C',
            y: this.formatQuickTotalPercent(pollData.mc_c_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, c_data]
    }
    if (pollData.mc_d_option){
        quickTotals.categories['D'] = pollData.mc_d_option
        let d_data = {
            id:'D',
            y: this.formatQuickTotalPercent(pollData.mc_d_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, d_data]
    }
    console.log('TOTAL VOTES', voteTotals)
    return quickTotals
},

formatQuickTotalPercent : function(divided){
    let percent = divided*100
    let rounded = Math.round(percent * 100) / 100
    return rounded;
}

}