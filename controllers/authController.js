const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const jwt = require ('jsonwebtoken')


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

    if (existingUserTelephone && existingUserEmail) { // Her ikisi de null değilse
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
    const { email, password } = req.body; //İstek gövdesinden gelen email ve password değerlerini çıkartıyoruz.(Kullanıcıdan veriyi aldığımız kısım)
    const user = await User.findOne({ email }); // Kullanıcıdan aldığınız email değeriyle, veritabanında User modelindeki email alanı eşleşen bir kullanıcı belgesini bulmak için
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        error: 'Kayitli kullanici bulunamadi',
      });
    }
    const same = await bcrypt.compare(password, user.password); //kullanıcının girdiği şifrenin, veritabanındaki kullanıcının şifresiyle eşleşip eşleşmediğini kontrol eder,Karşılaştırma sonucu same değişkenine atanır.
    if (same) {
      //eğer şifreler eşleşirse çalışır yoksa üstteki if çalışır
      const token = createToken(user._id);
      req.session.userID = user._id; //Yukarıda tanımladığımız user'ın id'sini userID'ye atayacağız (Her kullanıcının farklı ıd'si vardı bu da o)(Hangi kullanıcının giriş işlemi yaptığını ayıt edebiliriz)
      res.status(200).json({
        status: 'success',
        user,
        token,
      });
    } else {
      res.status(400).json({
        status: 'fail',
        error: 'Girdiginiz şifre yanlis',
      });
    }
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


const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};