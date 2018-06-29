const env = {
      uid: process.env.uid
  };


module.exports = {
    checkForToken : function(token){
        if(!token) {
            throw new Error('no token found')
        }
    return token
    },
    validateUid : (user) => {
        console.log('USER DATA IN TOKEN',user)
        console.log(user[`${env.uid}`])
        return new Promise((resolve, reject)=>{
            console.log(user[`${env.uid}`])
            if (!user[`${env.uid}`]){
                var error = new Error('no user id found in auth0');
                reject(error)
            } else {
                console.log('uid is validated!', user)
                resolve(user)
            }
        })
    },
    notNumberOrNull: (value)=> {
    if (typeof value === 'number'){
            return false
        }
    if (value === null){
        return false
    }
    return true;
    },

 notStringOrNull : (value) => {
    if (typeof value === 'string'){
            return false
        }
    if (value === null){
        return false
    }
    return true;
    },

 notBooleanOrNull : (value) => {
    if (typeof value === 'boolean'){
            return false
        }
    if (value === null){
        return false
    }
    return true;
    },
}