const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     default: null
    // },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
      }, 
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required:true
    },
      Address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookedAddress",
        required:true
    },
    Agent :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        default: null
    },
    ScreenShot:{
        type:String,
        required: true,
       },
    status: {
        type: String,
        enum:['Rejacted','Panding','Approved'],
        default: 'Panding'
    },
    // amount: {
    //     type: mongoose.Schema.Types.Number,
    //     default: null
    // },
    // order_id: {  
    // type: String,
    // default: null
    // },
    // order_token: {  
    // type: String,
    // default: null
    // },
    txn_msg: {
        type: String,
        default: null
    },
},{timestamps:true})


const transaction= mongoose.model("transaction",transactionSchema);
module.exports= transaction;
