const user = require('../models/User');
const jwt = require('jsonwebtoken');
const config = process.env;


exports.authenticateToken = async (req, res, next) => {
  try {
  const token = req.headers["authorization"]?.split(" ")[1];

  if(!token){
    return res.status(401).json({
      message:"Giriş yapılamadı"
    });
  }
  jwt.verify(token,process.env.JWT_SECRET,(error,user)=>{
    if(error){
      console.log(error);
      return res.status(400).json({
        status:'fail',
        error,
      })
    }
    req.user = user;
    next();
  });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
