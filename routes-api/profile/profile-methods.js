const bcrypt = require('bcrypt');
const superagent = require('superagent');
const jwt_decode =require('jwt-decode')

const validation = require('../../lib/validation-methods')
const auth_0 = require('../../lib/authprofile-methods')
const query =  require('./profile-queries')
const profileValidate = require('./profile-validation')


const profile = {};

    profile.fetchProfile = (req, res) => {
      let token = validation.checkForToken(req.headers.authorization)
      auth_0.getAuthProfile(token)
      .then(user=>{
        validation.validateUid(user)
        .then(user=>{
          query.fetchProfileQuery(res, user)
        })
        .catch(err=>console.log(err))
      })
      .catch(err=>console.log('error extracting user from auth 0',err))
    }

    profile.updateProfile = (req,res) => {
      let token = validation.checkForToken(req.headers.authorization)
      let profileInfo = profileValidate.userProfileValidate(req.body)
      auth_0.decodeToken(token)
      .then(user=>{
        validation.validateUid(user)
        .then(user=>{
          query.updateProfileQuery(res, user, profileInfo)
        })
        .catch(err=>{
          console.log(err)
          res(500).send(err)
        })
      })
      .catch(err=>{
        console.log(err)
        res(500).send(err)
      })
    }

    profile.delete 

module.exports = profile;

