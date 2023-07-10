const User = require('../models/User');


exports.getIndexPage = (req, res) => {
  console.log(req.session.userID); //hangi kullanıcı giriş yaptıysa konsola o kullanıcının id'sini yazdırıyorum (req.session.userID hangi kullanıcı o an aktifse onun id'sini tutuyor)
  res.status(200).render('index');
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register');
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login');
};


