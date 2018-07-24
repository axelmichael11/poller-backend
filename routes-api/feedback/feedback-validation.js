
const feedBack = {};

const validator = require('../../lib/validation-methods')

feedBack.validateFeedBackSubmitData = function(incomingFeedBackData){
    let {feedBack, nickname} = incomingFeedBackData;
    let feedBackData = Object.assign({},{feedBack, nickname});

    if (!feedBackData.nickname  || typeof feedBackData.nickname !== 'string'){
        throw new Error('invalid nickname type or length, or nonexistant property');
    }

    if (!feedBackData.feedBack  || typeof feedBackData.feedBack !== 'string'){
        throw new Error('invalid feedback type or length, or nonexistant property');
    }

    return feedBackData
}

module.exports = feedBack;
