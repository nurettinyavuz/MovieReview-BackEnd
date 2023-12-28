const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');
const movieSeries = require('../models/movieSeries');
const Comment = require('../models/Comment');


//TEKİL Film
exports.getMovieSeries = async (req, res) => {
  try {
    const movieseries = await movieSeries.findOne({ _id: req.params.id });
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

// SearchBar
exports.getSearchMovieSeries = async (req, res) => {
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
