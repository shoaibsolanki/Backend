const express = require("express");
const router = express.Router();
const multer = require('multer');
const Reciptes = require('../models/Recipte')
var fetchuser = require('../middleware/fetchuser');
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
router.post("/Recipte",fetchuser,uplaod.single('Recipte'), async (req,res)=>{
    try {
      const {name, email} = req.body
      const Recipte = req.file.path;
        const image = new Reciptes({
            user: req.user.id,
            name,
            email,
            Recipte,
        });
        const saveimage = await image.save();
        res.send(saveimage)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//API for get all Recipte
router.get('/getRecipte',async(req, resp)=>{
  try{
      const Recipts= await Reciptes.find({});
      resp.json(Recipts);
  }catch(error){
      console.error(error.message);
      resp.status(500).send('Internal Server Error 😒');
  }
  })
  

//   //API FOR APROVE TEANSACTION
//   router.patch("/aprove/:id", fetchuser, async (req, res) => {
//     try {
//       //Find the Note to be delete and delete it
//       let Transaction = await transaction.findById(req.params.id);
//       if (!Transaction) {
//         return res.status(404).send("Not Found");
//       }
  
//       // //allow deletion only if user Owns this Note
//       // if (Transaction.user.toString() !== req.user.id) {
//       //   return res.status(401).send("Not Allowed");
//       // }
//       Transaction = await transaction.findByIdAndUpdate(req.params.id, {status: "Approved"});
//       res.json({ Success: "Transaction Aproved", Transaction: Transaction });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   });
//   //API FOR Rejacted TEANSACTION
//   router.patch("/Rejacted/:id", fetchuser, async (req, res) => {
//     try {
//       //Find the Note to be delete and delete it
//       let Transaction = await transaction.findById(req.params.id);
//       if (!Transaction) {
//         return res.status(404).send("Not Found");
//       }
  
//       // //allow deletion only if user Owns this Note
//       // if (Transaction.user.toString() !== req.user.id) {
//       //   return res.status(401).send("Not Allowed");
//       // }
//       Transaction = await transaction.findByIdAndUpdate(req.params.id, {status: "Rejacted"});
//       res.json({ Success: "Transaction Aproved", Transaction: Transaction });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   });

//   //  API FOR Assing Agent 
//    router.patch("/Assing/:id",fetchuser, async (req, res) => {
//     const { Agent} = req.body;
//     //Update a newAddress Object
//     try {
//       const newTransation = {}
//       if (Agent) {
//         newTransation.Agent = Agent;
//       }
  
//       let Transation= await transaction.findById(req.params.id);
//       if (!Transation) {
//         return res.status(404).send("Not Found");
//       }
  
//       // if (Transation.user.toString() !== req.user.id) {
//       //   return res.status(401).send("Not Allowed");
//       // }
//       Transation = await transaction.findByIdAndUpdate(
//         req.params.id,
//         { $set: newTransation },
//         { new: true }
//       );
//       res.json({ Transation }); 
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   });

//   router.get('/agentTransaction',fetchuser,async(req, resp)=>{
//     try{
//         const Transaction= await transaction.find({Agent:req.user.id});
//         resp.json(Transaction);
//     }catch(error){
//         console.error(error.message);
//         resp.status(500).send('Internal Server Error');
//     }
//     })

  
  module.exports = router;