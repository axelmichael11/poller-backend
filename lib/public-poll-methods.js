const bcrypt = require('bcrypt');
const superagent = require('superagent');
const Date = require('datejs');

const publicPoll = {};

publicPoll.exploreValidate = function(incomingPublicPoll){
    let {created_at, author_username} = incomingPublicPoll;
    let explorePoll = Object.assign({},{created_at, author_username});

    if (!publicPoll.created_at  || typeof publicPoll.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    }

    if (!publicPoll.author_username  || typeof publicPoll.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }
    return publicPoll
}


module.exports = publicPoll;

