const bcrypt = require('bcrypt');
const superagent = require('superagent');

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./explore-queries')
const pollValidate = require('./explore-validation')


const explore = {}

explore.getPolls = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    console.log('TOKENNNNN##@#@', token)
    auth_0.decodeToken(token).then(user=>{
      console.log('USER INFORMATION', user)
      validation.validateUid(user)
      .then(user=>{
        console.log('VALIDATED UUID', user)
        query.getExploreQueries(res, user, 72)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }


  module.exports = explore;