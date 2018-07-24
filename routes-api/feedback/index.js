
const FeedBackRouter = require('express').Router();
  
const feedBack = require('./feedback-methods');

FeedBackRouter.post('/api/feedback', checkJwt, (req,res) => feedBack.sendFeedBack(req,res))


module.exports = FeedBackRouter;