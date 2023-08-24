
const express = require("express");
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
var RoleBase = require('../middleware/RoleBase');
const multer = require('multer');
const { sendFireBaseNOtificationFCM } = require("../util/fcmNotification");
const User = require("../models/User");
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


    router.post('/admin/notification/send', uplaod.single('image'), fetchuser,RoleBase('Agent','Admin'), async(req, res)=>{
        try {
            const { title, body, link, type } = req.body;
            if (!title || !body || !type) return res.status(400).send({ msg: "Please fill all the fields" });

            console.log('body data is ', req.body.tokens);
            const tokens = JSON.parse(req.body.tokens);
            sendFireBaseNOtificationFCM(tokens, {title, body}, {url: link? link : '', image: req.file ? req.file.path : ''})
            res.send({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
      })

      router.get('/User/all',fetchuser,RoleBase('Agent','Admin'),async(req, res)=>{
        try {
            const { draw, start, length, search, order, min, max } = req.query;
            const { value } = search;
            const { column, dir } = order[0];
            const sortOrder = dir === 'asc' ? 1 : -1;
            const validatedLength = length > 0 ? length : await User.countDocuments();
            const columns = ["_id", "_id", "Name", "phoneNo"];

            let start_date = min === "" ? new Date(null) : new Date(min);
            let end_date = max === "" ? new Date() : new Date(max);

            const totalUser = await User.aggregate([
                { $match: { role: "user" } },
                { $count: "Total" }
            ])
            const query = await User.aggregate([
                { $addFields: { phoneStr: { $toString: { $toLong: "$phoneNo" } }, ObjectId: { $toString: "$_id" } } },
                { $match: { $and: [{ role: "user" }, { $or: [{ Name: { $regex: value, $options: 'i' } }, { ObjectId: { $regex: value, $options: 'i' } }, { phoneStr: { $regex: value, $options: 'i' } } ] }] } },
                { $sort: { [columns[column]]: sortOrder } },
                {
                    $facet: {
                        paginatedResults: [{ $skip: parseInt(start) }, { $limit: parseInt(validatedLength) }],
                        totalCount: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                }
            ]);
            const allUser = query.pop();
            const data = {
                draw: draw,
                recordsTotal: totalUser.length ? totalUser[0].Total : 0,
                recordsFiltered: allUser.totalCount.length ? allUser.totalCount[0].count : 0,
                data: allUser.paginatedResults.length ? allUser.paginatedResults : []
            }
            res.send(data);
        
     } catch (error) {
        console.log(error);
    }
      })
 





module.exports = router;
