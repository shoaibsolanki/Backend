const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const addr =require('../models/Adress')
// const Country =require('../models/Contry')
// const State =require('../models/State')
// const City =require('../models/City')
const { body, validationResult } = require("express-validator");


// API FOR ADD ADDRESSS 
router.post("/Address",fetchuser,
    [
      body("name", "Enter Valid name").isLength({ min: 3 }),
      body("lastname", "Enter Valid lastname").isLength({ min: 3 }),
      body("address", "Address Must be ten Charactor").isLength({
        min: 7,
      }),
      body("landmark", "landmark Must be Three Charactor").isLength({
        min: 3,
      }),
      body("phoneNo", "Phone No. Must be ten Charactor").isLength({
        min: 10, max:10
      }),
      body("pincode", "pincode Must be ten Charactor").isLength({
        min: 6,
      }),
      body("city", "city Must be Three Charactor").isLength({
        min: 3,
      }),
      body("state", "state Must be Three Charactor").isLength({
        min: 3,
      }),
    ],
    async (req, res) => {
  
      try {
        const { name,lastname,address, landmark,phoneNo,pincode,city,state} = req.body;
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({Success:false, errors: errors.array() });
        }
  
        const Add = new addr({
            user: req.user.id,
            name,
            lastname,
            address,
            landmark,
            phoneNo,
            pincode,
            city,
            state
        });
        const saveAddress = await Add.save();
        res.json({Success:true,  saveAddress});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  )

  // API FOR FETCHADDRESS
  router.get("/fetchaddress", fetchuser, async (req, res) => {
    try {
      const address = await addr.find({ user: req.user.id,});
      res.json(address);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // API FOR UPDATEADRESS
   
router.put("/updataddres/:id",fetchuser, async (req, res) => {
  const { name,lastname,address, landmark,phoneNo,pincode,city,state} = req.body;
  //Update a newAddress Object
  try {
    const newAddress = {};
    if (name) {
      newAddress.name = name;
    }
    if (lastname) {
      newAddress.lastname = lastname;
    }
    if (address) {
      newAddress.address = address;
    }
    if (landmark) {
      newAddress.landmark = landmark;
    }
    if (phoneNo) {
      newAddress.phoneNo = phoneNo;
    }
    if (pincode) {
      newAddress.pincode = pincode;
    }
    if (city) {
      newAddress.city = city;
    }
    if (state) {
      newAddress.state = state;
    }

    //Find the Address to be Update and Update it
    let Address= await addr.findById(req.params.id);
    if (!Address) {
      return res.status(404).send("Not Found");
    }

    if (Address.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
  Address = await addr.findByIdAndUpdate(
      req.params.id,
      { $set: newAddress },
      { new: true }
    );
    res.json({ Address });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

 // Router For DELETE ADDRESS 
 router.delete("/deleteAddres/:id", fetchuser,async (req, res) => {
  try {
    //Find the Tests to be delete and delete it
    let Addres = await addr.findById(req.params.id);
    if (!Addres) {
      return res.status(404).send("Not Found");
    }

    //allow deletion only if user Owns this Address
    if (Addres.user.toString() !== Addres.user.id) {
      console.log(Addres.user.id)
      
      Addres = await addr.findByIdAndDelete(req.params.id);
      res.json({ Success: "test has been deleted", Addres: Addres });
    }else{
      return res.status(401).send("Not Allowed");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});




// //Api for get all country 
//  router.get('/country',async(req, res)=>{
//  try {
//   const countries = await Country.find({ })
//   res.status(200).send({success:true, data:countries})

//  } catch (error) {
//   res.status(500).send("interna server error")
//  }
//  })
 
//  //Api for get State by Country short name 

//  router.get('/state',async(req, res)=>{
//   try {
//    const state = await State.find({ country_short_name: req.body.country_code })
//    res.status(200).send({success:true, data:state})
 
//   } catch (error) {
//    res.status(500).send("interna server error")
//   }
//   })

//   //Api for get City By State Code name 

//   router.get('/city',async(req, res)=>{
//     try {
//      const city = await City.find({ state_name:req.body.stateCode })
//      res.status(200).send({success:true, data:city})
   
//     } catch (error) {
//      res.status(500).send("interna server error")
//     }
//     })

 module.exports = router;