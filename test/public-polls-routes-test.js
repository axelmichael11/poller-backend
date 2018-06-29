require('dotenv').config({ path: `${__dirname}/.test.env` })
require('babel-register')

const expect = require('expect')
const superagent = require('superagent')

const server = require('../server/apiserver.js')
const API_URL = process.env.API_URL;

const API_TOKEN = process.env.API_TOKEN;

const AUTH0_ID = process.env.AUTH0_ID;

const __AUTH0_AUDIENCE__ = process.env.AUTH0_AUDIENCE

describe('testing public polls routes...', () => {
  before(server.start)
  after(server.stop)
  it('this is the public poll fetch method, should return ten randomly picked polls... there should be an array of three for testing purposes', () => {
    console.log('this is the APIR TOKEN', API_TOKEN)
    return superagent.get(`${API_URL}/api/explore`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .then(res => {
            let parsed = JSON.parse(res.text)
            console.log(parsed)
            expect(parsed.length).toEqual(3)
            expect(parsed).toBeTruthy()
        })
        .catch(err => {
    })
  })

  it('this is the public poll fetch method, should return randomly picked polls... there should be an empty array for testing purposes', () => {
    console.log('this is the APIR TOKEN', API_TOKEN)
    return superagent.get(`${API_URL}/api/explore`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .then(res => {
            let parsed = JSON.parse(res.text)
            console.log(parsed)
            expect(parsed.length).toEqual(0)
            expect(parsed).toBeTruthy()
        })
        .catch(err => {
    })
  })

})