const bcrypt = require('bcrypt');
const superagent = require('superagent');

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./feedback-queries')
const feedBackValidation = require('./feedback-validation')


const feedBack = {}


  feedBack.sendFeedBack = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    let feedBackData = feedBackValidation.validateFeedBackSubmitData(req.body)
    auth_0.getAuthProfile(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        query.submitFeedBack(res, user, feedBackData)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }

module.exports = feedBack;