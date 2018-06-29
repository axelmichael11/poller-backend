

// const env = {
//     AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
//     AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
//     AUTH0_CALLBACK_URL:
//       process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
//       users: process.env.userTable,
//       AUTH0_INFO: process.env.AUTH0_INFO,
//       AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
//       userName: process.env.DBuserName,
//       AUTH0_SIGNUP_CALLBACK_URL: process.env.AUTH0_SIGNUP_CALLBACK_URL,
//       AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
//       uid: process.env.uid,
//       questions_table: process.env.questions_table,
//   };

const ReportRouter = require('express').Router();
  
const report = require('./report-methods');

ReportRouter.post('/api/report', checkJwt, (req,res) => report.reportPoll(req,res))


module.exports = ReportRouter;