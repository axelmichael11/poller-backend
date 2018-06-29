

module.exports = {
    userPollValidate : function(incomingPoll){
        let {nickname, pollQuestion, pollSubject} = incomingPoll;
        let poll = Object.assign({},{nickname, pollQuestion, pollSubject});
        if (!poll.nickname || poll.nickname.length > 20 || typeof poll.pollSubject !== 'string'){
            throw new Error('invalid nickname type or length, or nonexistant property');
        }
        if (!poll.pollSubject || poll.pollSubject.length < 5 || typeof poll.pollSubject !== 'string'){
            throw new Error('invalid subject type or length, or nonexistant property');
        }
        if (!poll.pollQuestion || poll.pollQuestion.length < 10 || typeof poll.pollQuestion !== 'string'){
            throw new Error('invalid question type or length, or nonexistant property');
        }
        return poll
    },
    deletePollValidate : function(incomingPoll){
        let {created_at} = incomingPoll;
        
        let poll = Object.assign({},{created_at});
        if (!poll.created_at || typeof poll.created_at !== 'string'){
          throw new Error('invalid incomingPoll type or length, or nonexistant property');
        }
        return poll;
      },

      formatPollDeleteSend : function(queryResult){
        let {created_at} = queryResult;
        let deletedPoll = Object.assign({},{created_at});
        if (!deletedPoll.created_at || typeof deletedPoll.created_at !== 'string'){
          throw new Error('invalid poll type or length, or nonexistant property');
        }
        
        return deletedPoll;
      }
}