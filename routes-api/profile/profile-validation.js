
const country_list = require('./countries.js')
const profession_list = require('./professions.js')
const ethnicity_list = require('./ethnicities.js')
const validator = require('../../lib/validation-methods')


module.exports = {
    userProfileValidate : function(incomingProfile){
        let {gender, age, ethnicity, profession, country, religion, politics} = incomingProfile;
        let profile = Object.assign({},{ethnicity,gender, age, profession, country, religion, politics});
        for(var i in profile){
            if (profile[i] === undefined){
                profile[i] = null;
            }
        }
        if (validator.notStringOrNull(profile.country)){
        throw new Error('invalid country data type');
        }
        if (validator.notNumberOrNull(profile.profession)){
            throw new Error('invalid profession data type');
        }
        if (validator.notNumberOrNull(profile.ethnicity)){
            throw new Error('invalid ethnicity data type');
        }
        if (validator.notNumberOrNull(profile.politics)){
            throw new Error('invalid politics data type');
        }
            return profile
        },

    formatSendProfile : function(rows,authProfile){
        console.log('rows!', rows)
      let {gender, age, ethnicity, profession, country, religion, politics} = rows;
      let {nickname, picture, email} = authProfile;
      let returnedProfile = Object.assign({},{gender, age, profession, country, ethnicity, religion, politics, nickname, email, picture});
      return returnedProfile
    }
}