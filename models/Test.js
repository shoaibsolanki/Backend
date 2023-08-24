const mongoose = require ('mongoose');
const { Schema } = mongoose;

const TestSchema = new Schema({
   testImage:{
    type:String,
    required: true,
   },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    testtype:{
     type: String,
     required:true,
    },
    slug:{
     type: String,
     required:true,
     default: null
    },
    price:{
        type: Number,
        required: true,
    },
      date:{
        type: Date,
      default:Date.now 
    }
  });
const test = mongoose.model('Test',TestSchema);
module.exports = test;