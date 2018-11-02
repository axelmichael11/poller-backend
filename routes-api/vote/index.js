


const VoteRouter = require('express').Router();
  
const vote = require('./vote-methods');

VoteRouter.post('/api/votes', checkJwt, (req,res) => vote.getVotes(req,res))
VoteRouter.post('/api/castvote', checkJwt, (req,res) => vote.castVote(req,res))



module.exports = VoteRouter;

