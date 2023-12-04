const bcrypt = require('bcrypt');
const express = require('express');
//const User = require('../models/User');
const movieSeries = require('../models/movieSeries');
const Comment = require('../models/Comment');

exports.createMovieSeries = async (req, res) => {
  try {
    const movieseries = await movieSeries.create(req.body);
    res.status(201).json({
      status: 'success',
      movieseries,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

/* 
  exports.loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body; //İstek gövdesinden gelen email ve password değerlerini çıkartıyoruz.(Kullanıcıdan veriyi aldığımız kısım)
      const organizer = await Organizer.findOne({ email }); // Kullanıcıdan aldığınız email değeriyle, veritabanında User modelindeki email alanı eşleşen bir kullanıcı belgesini bulmak için
      console.log( organizer); 
      if (!organizer) {
        return res.status(400).json({
          status: 'fail',
          error: 'Girdiğiniz email yanlış',
        });
      }
      const same = await bcrypt.compare(password, organizer.password); //kullanıcının girdiği şifrenin, veritabanındaki kullanıcının şifresiyle eşleşip eşleşmediğini kontrol eder,Karşılaştırma sonucu same değişkenine atanır.
      if (same) {
        //eğer şifreler eşleşirse çalışır yoksa üstteki if çalışır
        req.session.organizerID = organizer._id; //Yukarıda tanımladığımız user'ın id'sini userID'ye atayacağız (Her kullanıcının farklı ıd'si vardı bu da o)(Hangi kullanıcının giriş işlemi yaptığını ayıt edebiliriz)
        res.status(200).json({
          status: 'success',
          organizer,
        });
      } else {
        res.status(400).json({
          status: 'fail',
          error: 'Girdiğiniz sifre yanlış',
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
exports.getAdmin = async (req, res) => {
  try {
    //burada Id yerine slug yakalıyoruz linkte ıd yerine title gözüksün diye
    const organizer = await Organizer.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      organizer,
    });
    console.log(organizer);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
}; 
*/

//TEKİL Film
exports.getMovieSeries = async (req, res) => {
  try {
    const movieseries = await movieSeries.findOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      movieseries,
    });
    console.log(movieseries);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

//Güncel Filmler
exports.CurrentMovies = async (req, res) => {
  try {
    const movieseries = await movieSeries.find({}).sort({startDate: -1}).limit(15); // 1 ( en küçük tarihten en büyüğe), -1 ( en büyük tarihten en küçüğe)
    console.log(movieseries);
    res.status(200).json({
      success: true,
      movieseries,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

// Organizasyon Listelemek
exports.getAllMovieSeries = async (req, res) => {
  try {
    const searchQuery = req.query.search; // Kullanıcının arama çubuğuna girdiği değeri alın
    const filter = {};

    if (searchQuery) {
      // Arama sorgusu varsa, "name" alanında veritabanında regex ile filtrele
      filter.name = { $regex: new RegExp(`^${searchQuery}`, 'i') };
    }

    // Tüm organizasyonları veritabanından çekin ve filtreleyin
    const moviesSeries = await movieSeries.find(filter);

    // Tarihleri şuanki tarihe göre sırala (en yakın tarih en üste gelecek şekilde)
    moviesSeries.sort((a, b) => {
      const aStartDate = new Date(a.startDate);
      const bStartDate = new Date(b.startDate);
      const currentDate = new Date();

      const timeDifferenceA = Math.abs(currentDate - aStartDate);
      const timeDifferenceB = Math.abs(currentDate - bStartDate);

      return timeDifferenceA - timeDifferenceB;
    });

    res.status(200).json({
      success: true,
      moviesSeries,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
