// elements now needed for quick results graph...
/* 
Title
'total Votes'

datapoint
    {-id
    -y
    -color}

categories
['a','b']
*/

const randomColor = require('randomcolor');




const explore = {};

const validator = require('../../lib/validation-methods')

explore.formatExploreData = function(exploreDataArray){
    let formattedExploreData = exploreDataArray.map(pollData=>{
            if (pollData.type=='MC'){
                let multipleChoiceExplorePoll = explore.formatMCExplorePoll(pollData)
                return multipleChoiceExplorePoll;
            } else {
                let yesNoExplorePoll = explore.formatYNExplorePoll(pollData)
                return yesNoExplorePoll;
            }
    })

    return formattedExploreData
}

explore.formatYNExplorePoll = function(pollData){
    let pollResults = {};
    pollResults.question = pollData.question;
    pollResults.subject = pollData.subject;
    pollResults.author_username = pollData.author_username;
    pollResults.created_at = pollData.created_at;
    // pollResults.expiration = pollData.expiration;
    pollResults.type = pollData.type;
    pollResults.categories = {};
    if (pollData.mc_a_option){
        pollResults.categories['Yes'] = pollData.mc_a_option
    }
    if (pollData.mc_b_option){
        pollResults.categories['No'] = pollData.mc_b_option
    }
    if (pollData.voted == 'true'){
        pollResults.quickTotals = explore.formatYNQuickTotals(pollData)
    }
    return pollResults;
}


explore.formatYNQuickTotals = function(pollData){
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
    quickTotals.categories['Yes'] = pollData.mc_a_option
    let yes_data = {
        id:pollData.mc_a_option,
        y: explore.formatQuickTotalPercent(pollData.mc_a_data / voteTotals),
        color: randomColor(),
    }
    quickTotals.data = [...quickTotals.data, yes_data]

    quickTotals.categories['No'] = pollData.mc_b_option
    let no_data = {
        id:pollData.mc_b_option,
        y: explore.formatQuickTotalPercent(pollData.mc_b_data / voteTotals),
        color: randomColor(),
    }
    quickTotals.data = [...quickTotals.data, no_data]
    
    return quickTotals
}

explore.formatMCExplorePoll = function(pollData){
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
        pollResults.quickTotals = explore.formatMCQuickTotals(pollData)
    }
    return pollResults;
}

explore.formatMCQuickTotals = function(pollData){
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
            id:pollData.mc_a_option,
            y: explore.formatQuickTotalPercent(pollData.mc_a_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, a_data]
    }

    if (pollData.mc_b_option){
        quickTotals.categories['B'] = pollData.mc_b_option
        let b_data = {
            id:pollData.mc_b_option,
            y: explore.formatQuickTotalPercent(pollData.mc_b_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, b_data]
    }
    if (pollData.mc_c_option){
        quickTotals.categories['C'] = pollData.mc_c_option
        let c_data = {
            id:pollData.mc_c_option,
            y: explore.formatQuickTotalPercent(pollData.mc_c_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, c_data]
    }
    if (pollData.mc_d_option){
        quickTotals.categories['D'] = pollData.mc_d_option
        let d_data = {
            id:pollData.mc_d_option,
            y: explore.formatQuickTotalPercent(pollData.mc_d_data / voteTotals),
            color: randomColor(),
        }
        quickTotals.data = [...quickTotals.data, d_data]
    }
    console.log('TOTAL VOTES', voteTotals)
    return quickTotals
}

explore.formatQuickTotalPercent = function(divided){
    let percent = divided*100
    let rounded = Math.round(percent * 100) / 100
    return rounded;
}



module.exports = explore;
