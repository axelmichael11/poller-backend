const Date = require('datejs');

const vote = {};

const validator = require('../../lib/validation-methods')

vote.validateGetVoteData = function(incomingGetVoteData){
    console.log('this is the incoming data', incomingGetVoteData)
    let {created_at, author_username} = incomingGetVoteData;
    let voteData = Object.assign({},{created_at, author_username});

    if (!voteData.created_at  || typeof voteData.created_at !== 'string'){
        throw new Error('invalid created_at type or length, or nonexistant property');
    }

    if (!voteData.author_username  || typeof voteData.author_username !== 'string'){
        throw new Error('invalid author_username type or length, or nonexistant property');
    }
    
    console.log('he0re is the votedata function,', voteData)
    return voteData
}

vote.validateCastVoteData = function(incomingPostVoteData){
    let {created_at,
        age, 
        country, 
        ethnicity, 
        gender,  
        profession,
        religion,
        vote, 
        author_username, } = incomingPostVoteData;


    let voteData = Object.assign({},{created_at,age, country, ethnicity, gender, profession, religion, vote, author_username});

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
    if (!voteData.vote || typeof voteData.vote !== 'string'){
        throw new Error('invalid vote data type or nonexistant property');
    }

    return voteData
}


vote.reducedYesOrNoData = function(dataArray){
    console.log('#@#@##@@#@# REDUCE METHOD')
    let dataCount = dataArray.reduce((acc, current, i)=>{
	console.log('current',acc, current, i)
    acc.totalVotes++;
    //age
	if(current[0]===null){
        acc.age_data['unknown age']=+1; 
    } else {
        let age = vote.categorizeAge(dataArray[i][0])
        console.log('AGEEEE',age)
        acc.age_data[age]=+1
    }
    //country
    if(current[1]===null){
        acc.country_data['unknown country']=+1; 
    } else {
        acc.country_data[current[1]]=+1
    }
    //ethnicity
    if(current[2]===null){
        acc.ethnicity_data['unknown ethnicity']=+1; 
    } else {
        acc.ethnicity_data[current[2]]=+1
    }
    //profession
    if(current[3]===null){
        acc.profession_data['unknown profession']=+1; 
    } else {
        acc.profession_data[current[3]]=+1
    }
    //gender
    if(current[4]===null){
        acc.gender_data['unknown gender']=+1; 
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
        acc.religion_data['unknown religion']=+1; 
    } else {
        let religion;
        if (current[5]===true){
            religion = 'religious';
        } else {
            religion = 'not religious';
        }
        acc.religion_data[religion]=+1
    }
	return acc
    }, {
        totalVotes:0,
        age_data:{},
        country_data:{},
        ethnicity_data:{},
        gender_data:{}, 
        profession_data:{}, 
        religion_data:{}
    });
    
    let result = {}
    result.totalVotes = dataCount.totalVotes
    result.age_data = vote.formatPercentofVotes(dataCount.age_data, dataCount.totalVotes);
    result.country_data = vote.formatPercentofVotes(dataCount.country_data, dataCount.totalVotes);
    result.ethnicity_data = vote.formatPercentofVotes(dataCount.ethnicity_data, dataCount.totalVotes);
    result.gender_data = vote.formatPercentofVotes(dataCount.gender_data, dataCount.totalVotes);
    result.profession_data = vote.formatPercentofVotes(dataCount.profession_data, dataCount.totalVotes);
    result.religion_data = vote.formatPercentofVotes(dataCount.religion_data, dataCount.totalVotes);
    console.log('result of reduced percents $%$%$%%$', result)
    return result;
}

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


vote.formatSendData = function(yes_data_array, no_data_array, voteCount, expiration){

    let isZero = (voteCount ===0);
    let data = {};
    data.totals_data = {}
    data.yes_data = vote.reducedYesOrNoData(yes_data_array);
    data.no_data = vote.reducedYesOrNoData(no_data_array);
    data.totals_data.yesVotes = isZero ? 0 : (data.yes_data.totalVotes/voteCount)*100;
    data.totals_data.noVotes = isZero ? 0 : (data.no_data.totalVotes/voteCount)*100;
    data.totals_data.totalVotes = voteCount;
    data.expiration = expiration;
    console.log('this is the DATA TO SEND', data)
    return data
}

vote.formatPercentofVotes = (categories, total) => {
    Object.keys(categories).map((category)=>{
        categories[category]= (categories[category])/total *100
    })

    console.log('vote categories...',categories)

    return categories
}

module.exports = vote;


