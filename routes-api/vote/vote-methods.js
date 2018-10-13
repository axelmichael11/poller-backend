const bcrypt = require('bcrypt');
const superagent = require('superagent');

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./vote-queries')
const voteValidate = require('./vote-validation')


const vote = {}

vote.getVotes = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    let voteData = voteValidate.validateGetVoteData(req.body)
    auth_0.decodeToken(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        if (voteData.type == 'YN'){
          query.YNgetVotes(res, user, voteData)
        }
        if (voteData.type == 'MC'){
          query.MCgetVotes(res, user, voteData)
        } else {
          throw new Error('Unidentified poll type')
        }
        // query.getVotes(res, user, voteData)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }

  vote.castVote = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    let voteData = voteValidate.validateCastVoteData(req.body)
    auth_0.decodeToken(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        if (voteData.type == 'YN'){
          query.YNcastVote(res, user, voteData)
        }
        if (voteData.type == 'MC'){
          query.MCcastVote(res, user, voteData)
        } else {
          throw new Error('Unidentified poll type')
        }
        console.log('hitting query stage', voteData )
        // query.castVote(res, user, voteData)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }


  module.exports = vote;