const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { telephone, email } = req.body;

    // Telefon numarası veya e-posta adresi kontrolü
    if (!telephone && !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Telefon numarası veya e-posta adresi girilmelidir.',
      });
    } else if ((!telephone && email) || (telephone && !email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Lütfen hem telefon numarası hem de e-posta adresi girin.',
      });
    }

    // Eğer telefon numarası veya e-posta adresi daha önce kullanıldıysa
    const existingUserTelephone = await User.findOne({ telephone }); //varsa eşitler yoksa null gönderir
    const existingUserEmail = await User.findOne({ email }); //varsa eşitler yoksa null gönderir

    if (existingUserTelephone && existingUserEmail) {
      // Her ikisi de null değilse
      return res.status(400).json({
        status: 'fail',
        message: 'Bu telefon numarası ve e-posta adresi zaten kullanılıyor.',
      });
      //Eğer girilen telephone  daha önce veritabanında kayıtlı ise null dönmeyecektir, kayıtlı değilse null döner ve hata vermez
    } else if (existingUserTelephone) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bu telefon numarası zaten kullanılıyor.',
      });
      //Eğer girilen e-posta adresi daha önce veritabanında kayıtlı ise null dönmeyecektir, kayıtlı değilse null döner ve hata vermez
    } else if (existingUserEmail) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bu e-posta adresi zaten kullanılıyor.',
      });
    }

    // Yeni kullanıcı oluşturuluyor
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        error: 'Kayitli kullanici bulunamadi',
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same){
      res.status(400).json({
        status: 'fail',
        error: 'Girdiginiz şifre yanlis',
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30s' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,//süre belirlemedim sonsuz süre olacak
      { expiresIn: '1m' }
    );
       
    const postmanAccessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    // Erişim belirtecini Postman'de "Cookie" başlığına eklemek için aşağıdaki kodu kullanın.
    res.setHeader('Set-Cookie', `accessToken=${postmanAccessToken}; Path=/`);

    res.status(200).json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });


  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        error: 'Kayitli kullanici bulunamadi',
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same){
      res.status(400).json({
        status: 'fail',
        error: 'Girdiginiz şifre yanlis',
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,//süre belirlemedim sonsuz süre olacak
    );
    
    res.status(200).json({
      success: true,
      user,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//TEKİL KİSİ
exports.getUser = async (req, res) => {
  try {
    //burada Id yerine slug yakalıyoruz linkte ıd yerine title gözüksün diye
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      user,
    });
    console.log(user);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
/* 
exports.extractCookie = async (req, res) => {
  try {
    const cookie = req.cookies.JWT_SECRET; // Çerez adını doğru şekilde belirtmelisiniz
    res.status(200).json({
      success: true,
      your_cookie: cookie,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
*/
/* 
exports.createToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};
*/

