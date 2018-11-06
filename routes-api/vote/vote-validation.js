const Date = require('datejs');
const randomColor = require('randomcolor');

const ethnicity_data = require('../../lib/ethnicities')
const profession_data = require('../../lib/professions')
const politics_data = require('../../lib/politics')

const vote = {};

const validator = require('../../lib/validation-methods')

vote.validateGetVoteData = function(incomingGetVoteData){
    console.log('this is the incoming data', incomingGetVoteData)
    let {created_at, author_username, type} = incomingGetVoteData;
    let voteData = Object.assign({},{created_at, author_username, type});

    if (!voteData.created_at  || typeof voteData.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    } 

    if (!voteData.author_username  || typeof voteData.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }

    if (!voteData.type || voteData.type.length > 3 || typeof voteData.type !== 'string'){
        throw new Error('invalid vote type or length, or nonexistant property');
    }
    
    console.log('he0re is the votedata function,', voteData)
    return voteData
}

vote.validateCastVoteData = function(incomingPostVoteData){
    let {author_username,
        created_at,
        age, 
        country, 
        ethnicity, 
        gender,  
        profession,
        religion,
        vote, 
        type } = incomingPostVoteData;


    let voteData = Object.assign({},{created_at,age, country, ethnicity, gender, profession, religion, vote, author_username, type,});

    if (!voteData.created_at  || typeof voteData.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    }

    if (!voteData.author_username  || typeof voteData.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }

    if (validator.notNumberOrNull(voteData.age)){
        console.log(voteData.age)
        throw new Error('invalid age data type');
    }
    if (validator.notStringOrNull(voteData.country)){
        throw new Error('invalid country data type');
    }
    if (validator.notNumberOrNull(voteData.ethnicity)){
        throw new Error('invalid ethnicity data type');
    }
    if (validator.notNumberOrNull(voteData.profession)){
        throw new Error('invalid profession data type');
    }
    if (validator.notBooleanOrNull(voteData.religion)){
        console.log('religion',voteData.religion)
        throw new Error('invalid religion data type', voteData.religion);
    }

    if (!voteData.vote || typeof voteData.vote !== 'string' || voteData.vote.length > 4){
        throw new Error('invalid vote data type or nonexistant property');
    }
    if (!voteData.type || voteData.type.length > 3 || typeof voteData.type !== 'string'){
        throw new Error('invalid type type or length, or nonexistant property');
    }

    return voteData
}


vote.collectVoteColumnData = function(dataArray, color, answerOption){
    console.log('#@#@##@@#@# VOTE COLLECT', dataArray)
    


    let dataCount = dataArray.reduce((acc, current, i)=>{
    //age
    console.log('CURRENT', current)
	if(current[0]===null){

        acc.age_data['Unknown']=+1;
    } else {
        let age = vote.categorizeAge(dataArray[i][0])
        console.log('AGEEEE',age)
        acc.age_data[age]=+1
    }
    //country
    if(current[1]===null){
        acc.country_data['Unknown']=+1; 
    } else {
        acc.country_data[current[1]]=+1
    }
    //ethnicity
    if(current[2]===null){
        acc.ethnicity_data['Unknown']=+1; 
    } else {

        acc.ethnicity_data[ethnicity_data[current[2]]]=+1
    }
    //profession
    if(current[3]===null){
        acc.profession_data['Unknown']=+1; 
    } else {
        acc.profession_data[profession_data[current[3]]]=+1
    }
    //gender
    if(current[4]===null){
        acc.gender_data['Unknown']=+1; 
    } else {
        let gender;
        if (current[4]=='M'){
            gender = 'male';
        } else {
            gender = 'female';
        }
        acc.gender_data[gender]=+1
    }
    //religion
    if(current[5]===null){
        acc.religion_data['Unknown']=+1; 
    } else {
        let religion;
        if (current[5]==='true'){
            religion = 'religious';
        } else {
            religion = 'not religious';
        }
        acc.religion_data[religion]=+1
    }

    // politics
    if(current[6]===null){
        acc.politics_data['Unknown']=+1; 
    } else {
        acc.politics_data[politics_data[current[6]]]=+1
    }
	return acc
    }, {
        age_data:{},
        country_data:{},
        ethnicity_data:{},
        gender_data:{}, 
        profession_data:{}, 
        religion_data:{},
        politics_data:{},
    });
    
    let result = {}

    result.age_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.age_data, dataArray.length), color, answerOption);
    result.country_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.country_data, dataArray.length), color, answerOption);
    result.ethnicity_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.ethnicity_data, dataArray.length), color, answerOption);
    result.gender_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.gender_data, dataArray.length), color, answerOption);
    result.profession_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.profession_data, dataArray.length), color, answerOption);
    result.religion_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.religion_data, dataArray.length), color, answerOption);
    result.politics_data = vote.buildDataPoints(vote.formatDemographicPercent(dataCount.politics_data, dataArray.length), color, answerOption);
    // delet
    console.log('result of reduced percents $%$%$%%$', result)
    
    return result;
}

vote.reducedMultipleChoiceColumn = function(dataArray){
    if (dataArray==null){
        return null
    }
},

vote.buildDataPoints = function( demographicVoteData, color, answerOption){

    class DataPoint {
        constructor(name, y, color){
            this.name = name;
            this.y = name;
            
            this.color = color
        }
      }

    
      return Object.keys(demographicVoteData).reduce((acc, curr)=>{
        let dataPoint = {
            name: curr,
            id: answerOption,
            y: demographicVoteData[curr],
            color: color,
          }
          return [...acc, dataPoint];
      }, [])
}

vote.formatDataPoint

vote.categorizeAge = function(age){
    console.log('this is the AGEEEE', age)
    let intAge = parseInt(age);

    let ageCategory;
    if(0 < age && age < 18 ){
        ageCategory = '0-17';
    }
    if ( 17 < age && age < 27 ) {
        ageCategory = '18-26';
    }
    if ( 26 < age && age < 33  ) {
        ageCategory = '27-32';
    }
    if ( 32 < age && age < 41  ) {
        ageCategory = '33-40';
    }
    if ( 40 < age && age < 51 ) {
        ageCategory = '41-50';
    }
    if ( 50 < age && age < 71 ) {
        ageCategory = '51-70';
    }
    if (70 < intAge) {
        ageCategory = '71 and Older';
    }
    return ageCategory
}


vote.YNformatSendData = function(yes_data_array, no_data_array, voteCount, expiration){

    let isZero = (voteCount ===0);
    let data = {};
    data.totals_data = {}
    data.type = 'YN'
    //demographic data
    data.yes_data = vote.collectVoteColumnData(yes_data_array);
    data.no_data = vote.collectVoteColumnData(no_data_array);

    //totals data
    data.totals_data.yesVotes = isZero ? 0 : (data.yes_data.totalVotes/voteCount)*100;
    data.totals_data.noVotes = isZero ? 0 : (data.no_data.totalVotes/voteCount)*100;
    data.totals_data.totalVotes = voteCount;
    // data.expiration = expiration;
    console.log('this is the DATA TO SEND', data)
    return data
}

vote.MCformatSendData = function(success){
    console.log("SUCCESS FROM DB FOR MC", success);
    let isZero = (success.voteCount ===0);
    let data = {};
    data.type = 'MC'
    data.answerOptions = {}
    data.labels = [];
    data.answerOptions.mc_a_data = {};
    let colorA = randomColor();
    data.answerOptions.mc_a_data.color = colorA
    data.answerOptions.mc_a_data.demographics = vote.collectVoteColumnData(success.mc_a_data, colorA, 'A');
    data.answerOptions.mc_a_data.answerOption = success.mc_a_option;
    data.answerOptions.mc_a_data.label = 'A'
    data.labels.push('A')
    data.answerOptions.mc_a_data.totalVotePercent = isZero ? 0 : vote.formatTotalVotesPercent((success.mc_a_data.length/success.count)*100);
    
    data.answerOptions.mc_b_data = {};
    let colorB = randomColor();
    data.answerOptions.mc_b_data.color = colorB
    data.answerOptions.mc_b_data.demographics = vote.collectVoteColumnData(success.mc_b_data, colorB, 'B');
    data.answerOptions.mc_b_data.answerOption = success.mc_b_option;
    data.answerOptions.mc_b_data.label = 'B'
    data.labels.push('B')
    data.answerOptions.mc_b_data.totalVotePercent = isZero ? 0 : vote.formatTotalVotesPercent((success.mc_b_data.length/success.count)*100);

    if (success.mc_c_option){
        data.answerOptions.mc_c_data = {};
        let colorC = randomColor();
        data.answerOptions.mc_c_data.color = colorC
        data.answerOptions.mc_c_data.demographics = vote.collectVoteColumnData(success.mc_c_data, colorC, 'C');
        data.answerOptions.mc_c_data.answerOption = success.mc_c_option;
        data.answerOptions.mc_c_data.label = 'C'
        data.labels.push('C')
        data.answerOptions.mc_c_data.totalVotePercent = isZero ? 0 : vote.formatTotalVotesPercent((success.mc_c_data.length/success.count)*100);

    } else {
        data.answerOptions.mc_c_data = null
    }
    
    if (success.mc_d_option){
        data.answerOptions.mc_d_data = {};
        let colorD = randomColor();
        data.answerOptions.mc_d_data.color = colorD
        data.answerOptions.mc_d_data.demographics = vote.collectVoteColumnData(success.mc_d_data, colorD, 'D');
        data.answerOptions.mc_d_data.answerOption = success.mc_d_option;
        data.answerOptions.mc_d_data.label = 'D'
        data.labels.push('D')
        data.answerOptions.mc_d_data.totalVotePercent = isZero ? 0 : vote.formatTotalVotesPercent((success.mc_d_data.length/success.count)*100);
    } else {
        data.answerOptions.mc_d_data = null
    }

    data.demographicLabels = {
        age_data:'Age',
        country_data:'Country',
        ethnicity_data:'Ethnicity',
        gender_data:'Gender', 
        profession_data:'Profession', 
        religion_data:'Religion',
        politics_data:'Politics',
    };


    data.totalVotes = success.count;
    data.question = success.question;
    data.author_username = success.author_username;
    // data.expiration = expiration;
    console.log('this is the MC DATA TO SEND', data)
    return data
},

vote.getLabels = function(){
    let {answerOptions} = this.props.pollData.totals_data;
      return Object.keys(answerOptions).reduce((acc, curr, i) =>{
        if (answerOptions[curr].answerOption){
          console.log(this.props.answerLabels[i],'being pushed')
          let dataPoint = this.props.answerLabels[i];
          return [...acc, dataPoint];
        } else {
          return acc
        }
      }, [])
  }



vote.formatDemographicPercent = (categories, total) => {
    console.log('categories', categories, total)
    Object.keys(categories).map((category)=>{
        let percent = (categories[category])/total *100
        let rounded = Math.round(percent * 100) / 100
        console.log("ROUNDED", rounded)
        categories[category]= rounded
    })
    return categories
}
vote.formatTotalVotesPercent = (num)=>{
    return Math.round(num * 100) / 100
}

vote.format

module.exports = vote;


