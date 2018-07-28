


const ReportRouter = require('express').Router();
  
const report = require('./report-methods');

ReportRouter.post('/api/report', checkJwt, (req,res) => report.reportPoll(req,res))


module.exports = ReportRouter;