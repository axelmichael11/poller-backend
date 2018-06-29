require('dotenv').config({ path: `${__dirname}/.test.env` })
require('babel-register')
const expect = require('expect')
const superagent = require('superagent')

const server = require('../server/apiserver.js')
const API_URL = process.env.API_URL;

const API_TOKEN = process.env.API_TOKEN;

const AUTH0_ID = process.env.AUTH0_ID;

const __AUTH0_AUDIENCE__ = process.env.AUTH0_AUDIENCE

const DB_UID = process.env.DB_UID;

describe('testing profile queries...', () => {
  before(server.start)
  after(server.stop)


  it('this is the profile create method, should return a user', () => {
    return superagent.get(`${API_URL}/api/user`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .then(res => {
            let parsed = JSON.parse(res.text)
            expect(res.text).toBeTruthy();
            console.log('parsed.data',parsed)
            return parsed;
          })
          .catch(err => console.log(err))
  })
  



})

