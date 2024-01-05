const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const movieSeries = require('../../models/movieSeries');
const Comment = require('../../models/Comment');

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
      error:error.message,
    });
  }
};

//Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        error: 'Kayitli kullanici bulunamadi',
      });
    }

    if(user.role == 'banned'){
      return res.status(400).json({
        status: 'fail',
        error: 'Kullanıcı yasaklandı.',
      });
    }

    if(user.role !== 'admin'){
      return res.status(400).json({
        status: 'fail',
        error: 'Bu işlem için yetkiniz yok',
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
      { userId: user._id, email: user.email },
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
      error:error.message,
    });
  }
};

//Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Kullanıcı Id'si alındı

    // Kullanıcıyı veritabanından bulun
    const user = await User.findById(userId);
    const users = req.user.userId;//JWT'den geldi

    // Kullanıcı mevcut değilse hata döndürün
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Kullanıcı bulunamadı.',
      });
    }

    if (users.role !== 'admin') {
      return res.status(400).json({
        status: 'fail',
        error: 'Bu işlem için yetkiniz yok',
      });
    }

    // Kullanıcıyı veritabanından silin
    await user.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Kullanıcı başarıyla silindi.',
    });
  } catch (error) {
    console.error('Hata:', error); // Hata mesajını daha ayrıntılı olarak yazdırın
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

//Banned Useer
exports.bannedUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const users = req.user.userId; //JWT'den geldi

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Kullanıcı bulunamadı.',
      });
    }

    if (users.role !== 'admin') {
      return res.status(400).json({
        status: 'fail',
        error: 'Bu işlem için yetkiniz yok',
      });
    }

    if (user.isBanned === false) {
      user.role = 'banned';
      user.isBanned = true;
    } else {
      user.role = 'user';
      user.isBanned = false;
    }

    await user.save();

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
