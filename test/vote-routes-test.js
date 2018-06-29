require('dotenv').config({ path: `${__dirname}/.test.env` })
require('babel-register')

const expect = require('expect')
const superagent = require('superagent')

const server = require('../server/apiserver.js')
const API_URL = process.env.API_URL;

const API_TOKEN = process.env.API_TOKEN;

const AUTH0_ID = process.env.AUTH0_ID;

const __AUTH0_AUDIENCE__ = process.env.AUTH0_AUDIENCE

describe('testing poll create route...', () => {
  before(server.start)
  after(server.stop)

  it.only('this is fetch poll method, should return vote results or no results if user has not voted', () => {
    let voteData = {question: "asdfasdfasdf", subject: "asdfasdf", author_username: "maxelson11", created_at: "05:04:07:52:30"}
    return superagent.get(`${API_URL}/api/votes`)
    .set('Authorization', `Bearer ${API_TOKEN}`)
    .send(voteData)
    .then(res => {
      let parsed = JSON.parse(res.text)
      console.log(parsed)
      expect(res.status).toEqual(401) //no votes...
    })
    .catch(err => {
        console.log(err)
    })
  })


  it('this is fetch poll method, should return vote results or no results if user has not voted', () => {
    let voteData = {question: "asdfasdfasdf", 
      subject: "asdfasdf", 
      author_username: "maxelson11", 
      created_at: "05:04:07:52:30",
      age:15, 
      country:10,
      email:"axelmichael11@gmail.com", 
      ethnicity:6, 
      gender:"M", 
      nickname:"maxelson11", 
      picture:"https://s.gravatar.com/avatar/e31dc6308f5e988a307d7634186d106d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fax.png",
      profession:1,
      religion:true,
      vote: 'yes'
    }
    return superagent.post(`${API_URL}/api/votes`)
    .set('Authorization', `Bearer ${API_TOKEN}`)
    .send(voteData)
    .then(res => {
      let parsed = JSON.parse(res.text)
      console.log(parsed)
      expect(res.status).toEqual(401) //no votes...
    })
    .catch(err => {
        console.log(err)
    })
  })
})