const mongoose = require('mongoose');
const RecipteSchema  = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
      }, 
      Recipte:{
        type:String,
        required: true,
       },
      name:{
        type:String,
        required: true,
       },
      email:{
        type:String,
        required: true,
       },
},{timestamps:true})


const Reciptes= mongoose.model("Reciptes",RecipteSchema);
module.exports= Reciptes;
