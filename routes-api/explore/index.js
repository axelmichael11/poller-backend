

const ExploreRouter = require('express').Router();
  
const explore = require('./explore-methods');

ExploreRouter.get('/api/explore', checkJwt, (req,res) => explore.getPolls(req,res))


module.exports = ExploreRouter;