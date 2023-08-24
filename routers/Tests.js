
const express = require("express");
const router = express.Router();
const EventEmitter = require('events')
// const fetchuser = require("../middleware/fetchuser");
const test = require("../models/Test");
const multer = require('multer')
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

const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const event = new EventEmitter();

let Count=0

event.on('TastAdd',()=>{
  Count++
  console.log(Count)
})

// Router 1 for All Tests
router.get('/alltests',async(req, resp)=>{
try{
    const tests= await test.find({});
    resp.json(tests);
}catch(error){
    console.error(error.message);
    resp.status(500).send('Internal Server Error');
}
})

// Router 2 for Search test
router.get('/search/:key' ,async (req,res)=>{
    // const { search } = req.body;
    const alltests= await test.find(
        {
      "$or":[
        {title:{$regex:req.params.key,}},
      ] 
    })
    res.send(alltests);
  })

// Router 3 for Add new test
router.post("/addtest", uplaod.single('testImage') ,
    [
      body("title", "Enter Valid title").isLength({ min: 3 }),
      body("description", "description Must be five Charactor").isLength({
        min: 5,
      }),
      body("testtype", "testtype Must be five Charactor").isLength({
        min: 3,
      }),
      body("price", "price Must be Two Charactor").isLength({
        min: 2,
      }),
    ],
    async (req, res) => {
      try {
        const { title, description, testtype,price} = req.body;
        const testImage = req.file.path;
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const slug = title.replaceAll(' ','-');
        const Test = new test({
          title,
          description,
          testtype,
          price,
          testImage,
          slug
        });
        const saveTest = await Test.save();
        res.json(saveTest);
        event.emit('TastAdd')
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  )

  //Router 4 for Update your Test
router.patch("/updattest/:id", uplaod.single('testImage'), async (req, res) => {
  try {
    const { title, description, testtype,price,} = req.body;
    const slug = title.replaceAll(' ','-');
    //Creat a newNote Object
      const newTest = {};
      if (req.file) {
        newTest.testImage = req.file.path;
      }
      if (slug) {
        newTest.slug = slug;
      }
      if (title) {
        newTest.title = title;
      }
      if (description) {
        newTest.description = description;
      }
      if (testtype) {
        newTest.testtype = testtype;
      }
      if (price) {
        newTest.price = price;
      }
  
      //Find the Note to be Update and Update it
      let tests= await test.findById(req.params.id);
      if (!tests) {
        return res.status(404).send("Not Found");
      }
  
    //   if (note.user.toString() !== req.user.id) {
    //     return res.status(401).send("Not Allowed");
    //   }
    else{

      tests = await test.findByIdAndUpdate(
        req.params.id,
        { $set: newTest },
        { new: true }
        );
        res.json({ tests });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
    // Router For DELETE TEST 
  router.delete("/deletetest/:id", async (req, res) => {
    try {
      //Find the Tests to be delete and delete it
      let Tests = await test.findById(req.params.id);
      if (!Tests) {
        return res.status(404).send("Not Found");
      }
  
      //allow deletion only if user Owns this Tests
      // if (Test.user.toString() !== req.user.id) {
      //   return res.status(401).send("Not Allowed");
      // }
      Tests = await test.findByIdAndDelete(req.params.id);
      res.json({ Success: "test has been deleted", Tests: Tests });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
// Router 5 for FILTER test
router.get('/filter/:slug' ,async (req,res)=>{
  // const { search } = req.body;
  const alltests= await test.findOne(
    {slug:req.params.slug}
     )
  res.send(alltests);
})

//Router for search test 
router.get('/search/:key',fetchuser,async (req,res)=>{
  // const { search } = req.body;
  const Test= await test.find(
      {
    "$or":[
      {title:{$regex:req.params.key,}},
      {description:{$regex:req.params.key}}
       


    ]
  })
  res.send(Test);
})

module.exports = router;