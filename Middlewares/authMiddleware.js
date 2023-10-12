const user = require('../models/User');
const jwt = require('jsonwebtoken');
const config = process.env;


exports.authenticateToken = async (req, res, next) => {
  try {
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGRmYmUxN2FiNTg0ZTlkMzUxYjYxMWUiLCJlbWFpbCI6Im51cmV0dGluQGdtYWlsLmNvbSIsImlhdCI6MTY5NjQwNTEyMCwiZXhwIjoxNjk2NDA2MDIwfQ.4rWrkk4JwZ4YF8SCILVUSLeFF4VLF9toBD4lBq7c7hI
    const token = req.headers['authorization']?.split(' ')[1];

    
    if (!token) {
      return res.status(401).json({
        message: 'Giriş yapılamadı',
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          status: 'fail',
          error,
        });
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
