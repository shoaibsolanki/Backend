const express = require("express");
const router = express.Router();
const multer = require('multer');
const transaction = require('../models/transaction')
var fetchuser = require('../middleware/fetchuser');
const { sendFireBaseNOtificationFCM } = require("../util/fcmNotification");
const User = require("../models/User");
const { admin } = require("../util/firebaseconfig");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb){
      cb(null, file.originalname)
  
    }
  })
  const fileFilter= (req,file,cb)=>{
    if (file.mimetype==='image/jpeg'||file.mimetype==='image/png') {
      cb(null, true)
      
    }else{
      cb(null, false)
    }
  }
   
  const uplaod = multer({storage: storage ,
     limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter:fileFilter,
  });


  
  //API for upload screen shot
router.post("/upload",fetchuser,uplaod.single('ScreenShot'), async (req,res)=>{
    try {
      const {test,Agent,Address} = req.body
      const ScreenShot = req.file.path;
        const image = new transaction({
            user: req.user.id,
            ScreenShot, 
            test,
            Agent,
            Address,
        });
        const saveimage = await image.save();
        const admins = await User.findOne({ role: "Admin" }).exec();
        if (admins) {
          console.log("this is call",admins.fcmToken)
          const title = "New Order Placed"
          const body = "Order By Some One"
          const link = "www.google.com"
          sendFireBaseNOtificationFCM([admins.fcmToken],{title, body} , {url: link? link : '', image: req.file ? req.file.path : ''})
        }
        res.send(saveimage)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



//API for get all Transaction
router.get('/allTransaction',async(req, resp)=>{
  try{
      const Transaction= await transaction.find({}).populate("user", "name").populate("test", "title").populate("Agent", "name");
      resp.json(Transaction);
  }catch(error){
      console.error(error.message);
      resp.status(500).send('Internal Server Error 😒');
  }
  })
  

  //API FOR APROVE TEANSACTION
  router.patch("/aprove/:id", fetchuser, async (req, res) => {
    try {
      //Find the Note to be delete and delete it
      let Transaction = await transaction.findById(req.params.id);
      if (!Transaction) {
        return res.status(404).send("Not Found");
      }
  
      // //allow deletion only if user Owns this Note
      // if (Transaction.user.toString() !== req.user.id) {
      //   return res.status(401).send("Not Allowed");
      // }
      Transaction = await transaction.findByIdAndUpdate(req.params.id, {status: "Approved"});

      res.json({ Success: "Transaction Aproved", Transaction: Transaction });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });



  //API FOR Rejacted TEANSACTION
  router.patch("/Rejacted/:id", fetchuser, async (req, res) => {
    try {
      //Find the Note to be delete and delete it
      let Transaction = await transaction.findById(req.params.id);
      if (!Transaction) {
        return res.status(404).send("Not Found");
      }
  
      // //allow deletion only if user Owns this Note
      // if (Transaction.user.toString() !== req.user.id) {
      //   return res.status(401).send("Not Allowed");
      // }
      Transaction = await transaction.findByIdAndUpdate(req.params.id, {status: "Rejacted"});
      res.json({ Success: "Transaction Aproved", Transaction: Transaction });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });



  //  API FOR Assing Agent 
   router.patch("/Assing/:id",fetchuser, async (req, res) => {
    const { Agent} = req.body;
    //Update a newAddress Object
    try {
      const newTransation = {}
      if (Agent) {
        newTransation.Agent = Agent;
      }
  
      let Transation= await transaction.findById(req.params.id);
      if (!Transation) {
        return res.status(404).send("Not Found");
      }
  
      // if (Transation.user.toString() !== req.user.id) {
      //   return res.status(401).send("Not Allowed");
      // }
      Transation = await transaction.findByIdAndUpdate(
        req.params.id,
        { $set: newTransation },
        { new: true }
      );
      const notificationToagent = await User.findById( Agent ).exec();
      if (notificationToagent) {
        console.log("this is call",notificationToagent.fcmToken)
        const title = "New Order Assinged you"
        const body = "Order By Some One"
        const link = "https://www.google.com"
        sendFireBaseNOtificationFCM([notificationToagent.fcmToken],{title, body} , {url: link? link : '', image: req.file ? req.file.path : ''})
      }
      res.json({ Transation }); 
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
 

  //get Agent Assind Order
  router.get('/agentTransaction',fetchuser,async(req, resp)=>{
    try{
        const Transaction= await transaction.find({Agent:req.user.id});
        resp.json(Transaction);
    }catch(error){
        console.error(error.message);
        resp.status(500).send('Internal Server Error');
    }
    })

   

    //get transction by id
    router.get('/gettransction/:id',fetchuser,async(req, resp)=>{
      try{
          const Transaction= await transaction.findById({_id:req.params.id}).populate("test").populate("user","-password -role -Permissions -date").populate("Address","-user").populate("Agent","name phoneNo");
          resp.json(Transaction);
      }catch(error){
          console.error(error.message);
          resp.status(500).send('Internal Server Error 😒');
      }
      })
      
     


   //My All order Booked
   router.get('/my-order',fetchuser,async(req, resp)=>{
    try{
        const Transaction= await transaction.find({user: req.user.id}).populate("test").populate("user","-password -role -Permissions -date").populate("Address","-user").populate("Agent","name phoneNo");
        resp.json(Transaction);
    }catch(error){
        console.error(error.message);
        resp.status(500).send('Internal Server Error 😒');
    }
    })



  
  module.exports = router;