
const superagent = require('superagent');
const jwt_decode =require('jwt-decode')

module.exports = {
        getAuthProfile : (token) => {
        return superagent.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`)
            .set('Authorization',`${token}`)
            .set('scope','openid profile email read write user_metadata userId')
            .then((response)=>{
            return response.body
            })
            .catch(err=> console.log('error',err))
    },
    decodeToken: (token) => {
        let user_profile = jwt_decode(token)
        return new Promise((resolve, reject)=>{
            if (!user_profile){
                var error = new Error('unable to decode token');
                reject(error)
            } else {
                resolve(user_profile)
            }
        })
    }
}