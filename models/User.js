const mongoose = require ('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    phoneNo:{
     type: Number,
     required:true,
     unique:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
      default:Date.now 
    },
    role:{
      type:String,
      enum:['user','Agent','Admin'],
      required:true,
      default:'user'
    },
    fcmToken:{
    type:String,
    default:null
    },
    Permissions: [{
      Permission: {
          type: String,
          default: null
      },
      Status: {
          type: Boolean,
          default: false
      }
  }],
  });
const User = mongoose.model('user', UserSchema);
module.exports = User;
  