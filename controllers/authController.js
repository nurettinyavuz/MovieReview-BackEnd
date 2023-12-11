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
    if (!refreshToken) return res.status(401).json({ error: 'refreshToken eksik' });

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

//Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Kullanıcı Id'si alındı
    console.log("This user is deleted now"+userId);

    // Kullanıcıyı veritabanından bulun
    const user = await User.findById(userId);

    // Kullanıcı mevcut değilse hata döndürün
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Kullanıcı bulunamadı.',
      });
    }

    // Kullanıcıyı veritabanından silin
    await user.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Kullanıcı başarıyla silindi.',
    });
  } catch (error) {
    console.error("Hata:", error); // Hata mesajını daha ayrıntılı olarak yazdırın
    res.status(500).json({
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

//All User
exports.getAllUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userComment = await Comment.findById(userId).populate({
      path: 'user',
      options: { sort: { createdDate: -1 } }, // Yorumları yaratılma tarihine göre sırala
    });

    if (!userComment) {
      return res.status(404).json({
        success: false,
        message: 'Bu kişiye ait yorum bulunamadı',
      });
    }

    res.status(200).json({
      success: true,
      comments: userComment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

