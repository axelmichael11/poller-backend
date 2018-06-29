
const bcrypt = require('bcrypt');
const superagent = require('superagent');

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./poll-queries')
const pollValidate = require('./poll-validation')


const poll = {}

poll.postPoll = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    let validatedPoll = pollValidate.userPollValidate(req.body)
    auth_0.decodeToken(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        query.postPollQuery(res, user, validatedPoll)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }


  poll.deletePoll = (req,res)=> {
    let token = validation.checkForToken(req.headers.authorization)
    let validatedPoll = pollValidate.deletePollValidate(req.body)
    auth_0.decodeToken(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        query.deletePollQuery(res, user, validatedPoll)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }

  poll.getPolls = (req,res)=> {
    let token = validation.checkForToken(req.headers.authorization)
    auth_0.decodeToken(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        query.getPollsQuery(res, user, 72)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }

  module.exports = poll;