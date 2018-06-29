
const report = {};

const validator = require('../../lib/validation-methods')

report.validateReportPollData = function(incomingReportPollData){
    let {author_username, created_at, nickname} = incomingReportPollData;
    let reportData = Object.assign({},{created_at, author_username, nickname});

    if (!reportData.created_at  || typeof reportData.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    }

    if (!reportData.author_username  || typeof reportData.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }
    
    if (!reportData.nickname  || typeof reportData.nickname !== 'string'){
        throw new Error('invalid nickname type or length, or nonexistant property');
    }

    console.log('he0re is the reportData function,', reportData)
    return reportData
}

module.exports = report;
