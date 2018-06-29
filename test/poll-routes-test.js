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
  it('this is the poll create method, should return errors for missing right properties', () => {

    let poll = {nickname:'helloo'}
    console.log('this is the APIR TOKEN', API_TOKEN)
    return superagent.post(`${API_URL}/api/poll`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send(poll)
        .then(res => {
          try {
            let parsed = JSON.parse(res.text)
          
          expect(res.status).toEqual(500)
          expect(parsed).toEqual('Error: invalid nickname type or length, or nonexistant property')
          return parsed
          } catch (err) {
          }
        })
        .catch(err => console.log(err))
  })

  it('this should have errors for having incorrect subject lenght', ()=>{
    let poll = {nickname:'helloo', pollSubject:'11', pollQuestion:'alsdfsdfsdlfsdfalskdjfasd'}
    return superagent.post(`${API_URL}/api/poll`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send(poll)
        .then(res => {
          try {
            let parsed = JSON.parse(res.text)
          expect(res.status).toEqual(500)
          expect(parsed).toEqual('Error: invalid subject type or length, or nonexistant property')
          } catch (err) {
          }
        })
        .catch(err => console.log(err))
  })

  it('this should have errors for having incorrect question data type', ()=>{
    let poll = {nickname:'helloo', pollSubject:'11', pollQuestion:{sup:'helloooo'}}
    return superagent.post(`${API_URL}/api/poll`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send(poll)
        .then(res => {
          try {
            let parsed = JSON.parse(res.text)
        //   console.log('here is the parsed',parsed);
          expect(res.status).toEqual(500)
          expect(parsed).toEqual('Error: invalid question type or length, or nonexistant property')
       
          } catch (err) {
            console.log('THIS IS THE ERROR from posting a poll',err)
          }
        })
        .catch(err => console.log(err))
  })

  it('this should successfully insert the poll...', ()=>{
    let poll = {nickname:'helloo', pollSubject:'what is the meaning of life??', pollQuestion:'what is the meaning of life? I must knowwwww'}
    console.log('this is the APIR TOKEN', API_TOKEN)
    return superagent.post(`${API_URL}/api/poll`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send(poll)
        .then(res => {
          try {
            let parsed = JSON.parse(res.text)
          expect(res.status).toEqual(200)
          
          } catch (err) {
            let parsedError = JSON.parse(err.text)
            console.log('THIS IS THE ERROR from posting a poll',parsedError)
          }
        })
        .catch(err => {
          let parsedError = JSON.parse(err.text)
            console.log('THIS IS THE ERROR from posting a poll',parsedError)
        })
  })

  it('this should throw error for having too many questions three max assumed put in before...', ()=>{
    let poll = {nickname:'helloo', pollSubject:'what is the meaning of life??', pollQuestion:'what is the meaning of life? I must knowwwww'}
    console.log('this is the APIR TOKEN', API_TOKEN)
    return superagent.post(`${API_URL}/api/poll`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send(poll)
        .then(res => {
          try {
            let parsed = JSON.parse(res.text)
          console.log('here is the parsed77777777777 response poll insert!!',parsed)
          } catch (err) {
            console.log('THIS IS THE ERROR from posdfsdfsfsting a poll',err)
            let parsedError = JSON.parse(err.text)
           
          }
        })
        .catch(err => {
          console.log('THIS IS THE2333333 ERROR from posting a poll',err)
          expect(err.status).toEqual(550)
        })
  })


  it('this should throw error for having question length requirements for the querry.... , denoting with 500 error', ()=>{
    let poll = {nickname:'helloo', pollSubject:'what is the meaning of life??', pollQuestion:'kaljshhhhhhhhhhhhhhhhhhhhhhdfasdl;kfl;kasjdfl;ksjdf;lkasdlf;kjasld;fkjasdfksdfsdfsdfsssssssssssssssssssssdfsdfsdf'}
    console.log('this is the APIR TOKEN', API_TOKEN)
    return superagent.post(`${API_URL}/api/poll`)
        .set('Authorization',`Bearer ${API_TOKEN}`)
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .send(poll)
        .then(res => {
          try {
            let parsed = JSON.parse(res.text)
          console.log('here is the parsed77777777777 response poll insert!!',parsed)
          } catch (err) {
            console.log('THIS IS THE ERROR from posdfsdfsfsting a poll',err)
            let parsedError = JSON.parse(err.text)
          }
        })
        .catch(err => {
          console.log('THIS IS ERROR from posting a poll',err)
          expect(err.status).toEqual(500)
        })
  })


  
it('this should throw 500 error for having incorrect timestamp', ()=>{
  console.log('this is the APIR TOKEN', API_TOKEN)
  let examplePoll= {created_at:'2018-05-01 1asdfsfsdfsdf4sdfsdf'}
  return superagent.delete(`${API_URL}/api/poll`)
      .set('Authorization',`Bearer ${API_TOKEN}`)
      .set('accept', 'application/json')
      .set('content-type', 'application/json')
      .send(examplePoll)
      .then(res => {
        let parsed = JSON.parse(res.text)
        console.log('here is the parsed77777777777 response poll delete!!',parsed)
        expect(res.status).toEqual(500)
      })
      .catch(err => {
        console.log(err)
      })
})

it('this should delete a poll, return the deleted timestamp', ()=>{
  console.log('this is the APIR TOKEN', API_TOKEN)
  let examplePoll= {created_at:'2018-05-01 18:13:31.00866'}
  return superagent.delete(`${API_URL}/api/poll`)
      .set('Authorization',`Bearer ${API_TOKEN}`)
      .set('accept', 'application/json')
      .set('content-type', 'application/json')
      .send(examplePoll)
      .then(res => {
        let parsed = JSON.parse(res.text)
        console.log('here is the parsed77777777777 response poll delete!!',parsed)
        expect(res.status).toEqual(200)
        expect(parsed.created_at).toBeTruthy()
      })
      .catch(err => {
        console.log(err)
      })
})

  
it('should grab all polls of a user', ()=>{
  console.log('this is the APIR TOKEN', API_TOKEN)
  return superagent.get(`${API_URL}/api/poll`)
      .set('Authorization',`Bearer ${API_TOKEN}`)
      .set('accept', 'application/json')
      .set('content-type', 'application/json')
      .then(res => {
        let parsed = JSON.parse(res.text)
        console.log('poll retrieve!!',parsed)
        expect(res.status).toEqual(200)
      })
      .catch(err => {
        console.log(err)
      })
})



  


})

