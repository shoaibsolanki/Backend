// const country = require('country-state-city').Country;
// const state = require('country-state-city').State;
// const City = require('country-state-city').City;

// console.log(City.getAllCities())

// const MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://127.0.0.1:27017/', function(err,db){
  
//    if(err) throw err;
    
//     var dbo = db.db('MadPharma')
//   //for store all countries in data base 
//    var allcountry= dbo.collection('countrys').initializeOrderedBulkOp()

//    var countries = country.getAllCountries();

//    countries.forEach(contry=>{
//     allcountry.insert({name: contry.name, short_name:contry.isoCode})
//    })
//    allcountry.execute();
//    console.log("country inserted ")


//    //foe store all state in data base 
//    var allState= dbo.collection('states').initializeOrderedBulkOp()

//    var states = state.getAllStates();

//    states.forEach(st=>{
//     allState.insert({name: st.name, country_short_name:st.countryCode })
//    })
//    allState.execute();
//    console.log("state inserted ")

//    //for store all citys in data base 
//    var allcity= dbo.collection('citys').initializeOrderedBulkOp()

//    var citys = City.getAllCities();

//    citys.forEach(ct=>{
//     allcity.insert({name: ct.name, state_name: ct.stateCode })
//    })
//    allcity.execute();
//    console.log("City inserted ")
 
// })