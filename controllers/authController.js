const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const Comment = require('../models/Comment');
const movieSeries = require('../models/movieSeries');

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

let refreshTokens = [];

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ error: 'refreshToken eksik' });

    // refreshTokens dizisini kontrol edin
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ error: 'Geçersiz refreshToken' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }

      const accessToken = jwt.sign(
        { userId: data.userId, email: data.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

//Login user
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

    if (user.role == 'banned') {
      return res.status(400).json({
        status: 'fail',
        error: 'Kullanıcı yasaklandı.',
      });
    }

    if (user.role == 'admin') {
      return res.status(400).json({
        status: 'fail',
        error: 'Admin girişi yapamazsınız.',
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return res.status(400).json({
        status: 'fail',
        error: 'Girdiginiz şifre yanlis',
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET // süre belirlemedim sonsuz süre olacak
    );

    // refreshTokens dizisine refreshToken'i ekleyin
    refreshTokens.push(refreshToken);

    // Erişim belirtecini Postman'de "Cookie" başlığına eklemek için aşağıdaki kodu kullanın.
    res.setHeader('Set-Cookie', `accessToken=${accessToken}; Path=/`);

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

//Logout User
exports.logoutUser = (req, res) => {
  try {
    // Kullanıcının mevcut erişim belirtecini alın
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      res.clearCookie('accessToken');

      res.status(200).json({
        success: true,
        message: 'Çıkış başarılı.',
      });
    } else {
      res.status(401).json({
        status: 'fail',
        error: 'Oturum açmış bir kullanıcı yok.',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: 'Çıkış işlemi sırasında bir hata oluştu.',
    });
  }
};

//TEKİL KİSİ
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// All User
exports.getAllUsers = async (req, res) => {
  try {
    // Kullanıcıları belirli sayfaya göre getir
    const allUsers = await User.find();

    //hiç kullanıcı bulunamazsa veya kullanıcı listesi boşsa
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hiç kullanıcı bulunamadı',
      });
    }

    res.status(200).json({
      success: true,
      allUsers,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.message,
    });
  }
};

exports.getFavoriteMovieSeries = async (req, res) => {
  try {
    const userId = req.params.id; // URL'den gelen user id

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        error: 'User not found',
      });
    }

    // Kullanıcının favori film dizilerini getir
    const favoriteMovieSeries = await movieSeries.find({ _id: { $in: user.favoriteMovieSeries } });

    res.status(200).json({
      status: 'success',
      favoriteMovieSeries,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};


