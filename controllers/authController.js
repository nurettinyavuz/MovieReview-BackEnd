const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const Organization = require('../models/Organization');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    //try-catch yapmamızın nedeni hatayı yakalamak içi
    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      //Hatalı request gönderilirse dönecek
      //Oluşturulan yeni kursu template'e göndermiyoruz json dosyasında saklıyacaağız
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
        error: 'No such user found',
      });
    }
    const same = await bcrypt.compare(password, user.password); //kullanıcının girdiği şifrenin, veritabanındaki kullanıcının şifresiyle eşleşip eşleşmediğini kontrol eder,Karşılaştırma sonucu same değişkenine atanır.
    if (same) {
      //eğer şifreler eşleşirse çalışır yoksa üstteki if çalışır
      req.session.userID = user._id; //Yukarıda tanımladığımız user'ın id'sini userID'ye atayacağız (Her kullanıcının farklı ıd'si vardı bu da o)(Hangi kullanıcının giriş işlemi yaptığını ayıt edebiliriz)
      res.status(200).json({
        status: 'success',
        user,
      });
    } else {
      res.status(400).json({
        status: 'fail',
        error: 'No such user found',
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

exports.createOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.create(req.body);
    res.status(201).json({
      status: 'success',
      organizer,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json({
      status: 'success',
      organization,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
