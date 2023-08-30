const user = require('../models/User');
const jwt = require('jsonwebtoken');

exports.authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //jsonwebtoken authController'dan geldi

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          next();
        }
      });
    } else {
        res.redirect('/login');

    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
