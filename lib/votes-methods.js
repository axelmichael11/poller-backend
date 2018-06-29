const Date = require('datejs');

const vote = {};


function notNumberOrNull (value) {
    if (typeof value === 'number'){
            return false
        }
    if (typeof value === null){
        return false
    }
    return true;
    };

function notStringOrNull (value) {
    if (typeof value === 'string'){
            return false
        }
    if (typeof value === null){
        return false
    }
    return true;
    };

function notBooleanOrNull (value) {
    if (typeof value === 'boolean'){
            return false
        }
    if (typeof value === null){
        return false
    }
    return true;
    };

vote.validateGetVoteData = function(incomingGetVoteData){
    let {created_at, author_username} = incomingGetVoteData;
    let voteData = Object.assign({},{created_at, author_username});

    if (!voteData.created_at  || typeof voteData.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    }

    if (!voteData.author_username  || typeof voteData.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }
    
    return voteData
}

vote.validatePostVoteData = function(incomingPostVoteData){
    let {created_at,
        age, 
        country, 
        ethnicity, 
        gender,  
        profession,
        religion,
        vote, 
        author_username, } = incomingGetVoteData;


    let voteData = Object.assign({},{created_at,age, country, ethnicity, gender, profession, religion, vote, author_username});

    if (!voteData.created_at  || typeof voteData.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    }

    if (!voteData.author_username  || typeof voteData.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }

    if (notNumberOrNull(voteData.age)){
        throw new Error('invalid age data type');
    }
    if (notNumberOrNull(voteData.country)){
        throw new Error('invalid country data type');
    }
    if (notNumberOrNull(voteData.ethnicity)){
        throw new Error('invalid ethnicity data type');
    }
    if (notNumberOrNull(voteData.profession)){
        throw new Error('invalid profession data type');
    }
    if (notBooleanOrNull(voteData.religion)){
        throw new Error('invalid religion data type');
    }
    if (!voteData.vote || typeof voteData.vote !== 'string'){
        throw new Error('invalid vote data type or nonexistant property');
    }
    return voteData
}


module.exports = vote;