const bcrypt = require('bcrypt');
const superagent = require('superagent');

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./report-queries')
const reportValidation = require('./report-validation')


const report = {}


  report.reportPoll = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    let voteData = reportValidation.validateReportPollData(req.body)
    auth_0.getAuthProfile(token)
    .then(user=>{
      validation.validateUid(user)
      .then(user=>{
        query.reportPoll(res, user, voteData)
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
  }

module.exports = report;