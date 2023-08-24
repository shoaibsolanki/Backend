var jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'Soyamaliisagoodb$oy';

const fetchuser = async (req, res, next) => {
  try { 
    const token = req.header("authtoken");
    if (!token) {
     return res.status(200).send({ error: "please authenticate using a valid token " });
    }
    const data = jwt.verify(token, JWT_SECRET);
    // console.log(data)
    if (!data.user) return res.status(200).send({ error: "please authenticate using a valid token " });
    req.user = data.user;
    const requestedUser = await User.findById(data.user.id).exec();
    if (!requestedUser) return;
    req.role = requestedUser.role;
    next();
  } catch (error) {
    res.status(200).send({ error: "please authenticate using a valid token " });
  }
}

module.exports = fetchuser;