const bcrypt = require('bcrypt');
const superagent = require('superagent');

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./explore-queries')
const pollValidate = require('./explore-validation')


const explore = {}

explore.getPolls = (req, res) => {
    let token = validation.checkForToken(req.headers.authorization)
    query.getExploreQueries(res, 72)
  }


  module.exports = explore;