const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
// const { json } = require("stream/consumers");

const JWT_SECRET = "Soyamaliisagoodb$oy"
//route 1 creat a user using : Post "./api/auth/createuser". no login require Auth
router.post(
  "/createuser",
  [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("phoneNo", "Enter Valid phoneNo").isLength({ min: 10, max: 10 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password Must be five Charactor").isLength({ min: 5 })
  ],
  async (req, res) => {
    success = false;
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check whether user with this Email exists already
    try {
      let user = await User.findOne({ phoneNo: req.body.phoneNo });
      if (user) {
        return res.status(400).json({ success, error: "Sorry a User are already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creat a new use
      user = await User.create({
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        password: secPass,
        email: req.body.email
      });
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({ success, authtoken });
      //catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)

//route 2 Authentication a user using : Post "./api/auth/login". no login require
router.post("/login",
  [
    body("phoneNo", "Enter Valid PhoneNo").exists(),
    body("password", "Pasword cannot be blank").exists(),

  ], async (req, res) => {
    let success = false;
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phoneNo, password } = req.body;
    try {
      let user = await User.findOne({ phoneNo });
      if (!user) {
        success = false;
        return res.status(400).json({ success, error: "please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

//route 3 get logeddin user details using : Post "./api/auth/getuser". login required
router.post('/getuser/:id', fetchuser, async (req, res) => {
  try {
    // userId = req.user.id;
    const user = await User.findById(req.params.id).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");

  }
})

//get agent 
router.get("/get_Agent/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      res.status(200).send(user);
  } catch (e) {
      res.status(400).send(e)
  }
})
// post api for notifiction
router.post('/get/subsc/token',fetchuser,async(req, res)=>{
  try{
    const{ firebase_notify}=req.body;
    // const firebase_token = JSON.stringify(firebase_notify)
    console.log(req.user,firebase_notify)

     //if there are errors, return bad request and the errors
    //  const errors = validationResult(req);
    //  if (!errors.isEmpty()) {
    //    return res.status(400).json({ errors: errors.array() });
    //  }

    await User.findByIdAndUpdate(req.user.id,{ firebase_notify }, { new: true }).exec((error,result) => {
      if(error) 
      {
        res.send({ resCode: 500, errorMsg: error })
        throw error
      }
      else res.send({ resCode: 200, result})

    });
  }catch(error){
    console.error(error.massage)
    res.status(500).send("Internal server Error")
  }
})


//get ALL user 
router.post('/alluser', async (req, res) => {
  try {
    // userId= req.user.id;
    const user = await User.find({role:"user"}).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");

  }
})

// Admin Authentication API 
router.post(
  "/registarAdmin",
  [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("phoneNo", "Enter Valid phoneNo").isLength({ min: 10, max: 10 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password Must be five Charactor").isLength({ min: 5 })
  ],
  async (req, res) => {
    success = false;
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check whether user with this Email exists already
    try {
      let user = await User.findOne({ phoneNo: req.body.phoneNo });
      if (user) {
        return res.status(400).json({ success, error: "Sorry a User are already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creat a new use
      user = await User.create({
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        password: secPass,
        email: req.body.email,
        role: "Admin"
      });
      const data = {
        user: {
          id: user.id
        }
      }
      //  const authtoken =  jwt.sign (data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({ success, user });
      //catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)
// Agent Registar Authentication API 
router.post(
  "/agentsingup",
  [
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("phoneNo", "Enter Valid phoneNo").isLength({ min: 10, max: 10 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password Must be five Charactor").isLength({ min: 5 })
  ],
  async (req, res) => {
    success = false;
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check whether user with this Email exists already
    try {
      let user = await User.findOne({ phoneNo: req.body.phoneNo });
      if (user) {
        return res.status(400).json({ success, error: "Sorry a User are already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creat a new use
      user = await User.create({
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        password: secPass,
        email: req.body.email,
        role: "Agent"
      });
      const data = {
        user: {
          id: user.id
        }
      }
      //  const authtoken =  jwt.sign (data, JWT_SECRET);

      // res.json(user);
      success = true;
      res.json({ success, user });
      //catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)

// API FOR LOGIN ADMINs
router.post("/Adminlogin",
  [
    body("phoneNo", "Enter Valid PhoneNo").exists(),
    body("password", "Pasword cannot be blank").exists(),
  ], async (req, res) => {
    let success = false;
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }
    const { phoneNo, password } = req.body;
    try {
      let user = await User.findOne({ phoneNo, role: 'Admin' });
      if (!user) {
        user = await User.findOne({ phoneNo, role: 'Agent' });
      }
      if (!user) {
        success = false;
        return res.status(200).json({ success, error: "Please Register" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(200).json({ success, error: "Incorrect credentials" });
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, user, authtoken })

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
   // API FOR me
  router.get('/me',fetchuser,async (req,res)=>{
    try {
      if(req.user){
        const user =await User.findById(req.user.id);
        res.send(user);
      }
    } catch (error) {
      res.status(500).json("internal server error");
    }

  })



//Get all Agent DATA

router.post('/getAgent', async (req, res) => {
  try {
    // userId= req.user.id;
    const user = await User.find({role:"Agent"}).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");

  }
})

// Delete Agent by Id
 router.delete("/deleteagent/:id", async (req, res) => {
  try {
    //Find the Agents to be delete and delete it
    let Agents = await User.findById(req.params.id);
    if (!Agents) {
      return res.status(404).send("Not Found");
    }

    //allow deletion only if user Owns this Agents
    // if (Test.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }
    Agents = await User.findByIdAndDelete(req.params.id);
    res.json({ Success: "agent has been deleted", Agents: Agents });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//give persmission to Agent
router.patch("/agent/permission/:id", async (req, res) => {
  try {
      const permission =
          [
              { Permission: 'dashboard', Status: false },
              { Permission: 'Alltest', Status: false },
              { Permission: 'addnewtest', Status: false },
              { Permission: 'allagent', Status: false },
              { Permission: 'Allusers', Status: false },
              { Permission: 'AddAgent', Status: false }, 
              { Permission: 'Permission', Status: false },
              { Permission: 'transaction', Status: false },
             
          ];

      const data = await User.findByIdAndUpdate(req.params.id, { $push: { Permissions: permission } }, { new: true })
      res.send(data)
      console.log(data);
  } catch (e) {
      res.send(e)
      console.log(e);
  }

})


router.post("/agent/permission/nested/:id", fetchuser, async (req, res) => {
  console.log(req.body, 'jdfskljasldk;fj', req.params.id);
  try {

      // const data = await User.find({"Permissions._id":req.params.id} )
      // console.log(`${data.Permissions}`);
      // data.Permissions.Permission = req.body.Permission;
      // data.Permissions.Status = req.body.Status;
      // data.save()
      // res.send(data)
      const updateResult = await User.findOneAndUpdate(
          { 'Permissions._id': req.params.id },
          { 'Permissions.$.Status': req.body.Status }
      );
      console.log(updateResult.Permissions, 'ksjdflkasjdflkjaslkfj')
      //   (err, result) => {
      //     if (err) {
      //       console.log(err,'slkdfjalskd')
      //       res.status(500)
      //       .json({ error: 'Unable to update competitor.', });
      //     } else {
      //       console.log(result.matchedCount,'sdlkfja')
      //       res.status(200)
      //       .json(result);
      //     }
      //  }
      res.send(updateResult)
  } catch (e) {
      res.send(e)
      console.log(e);
  }

})


// save notification token in database
router.post("/updatetoken", fetchuser, async(req, res)=>{
  const { token } = req.body;
  // Assuming you have a logged-in user and their ID is available in `req.user.id`
  const userId = req.user.id;
  try {
      // Update the user's FCM token in the database
      await User.findByIdAndUpdate(userId, { fcmToken: token });
      res.status(200).json({ message: "Token updated successfully" });
  } catch (error) {
      console.error("Error updating token:", error);
      res.status(500).json({ message: "Failed to update token" });
  }
})



module.exports = router;
