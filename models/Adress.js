const mongoose = require ('mongoose');
const {Schema} = mongoose;

const AdressSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
      }, 
    name:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    landmark:{
        type: String,
        required: true
    },
    phoneNo:{
     type: Number,
     required:true,
    },
    pincode:{
       type: Number,
       required:true,
      },
     city:{
      type:String,
      require:true,
     },
     state:{
      type:String,
      require:true,
     },
    date:{
        type: Date,
      default:Date.now 
    },
    });
const book = mongoose.model('bookedAddress', AdressSchema);
module.exports = book;
  