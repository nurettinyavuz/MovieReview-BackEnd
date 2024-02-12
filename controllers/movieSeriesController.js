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

exports.getAllMovieSeries = async (req, res) => {
  try {
    // Kullanıcıları belirli sayfaya göre getir
    const allmovieseries = await movieSeries.find();

    res.status(200).json({
      success: true,
      allmovieseries,
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
    const movieseries = await movieSeries.find({});

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

exports.favoriteMovieSeries = async (req, res) => {
  try {
    const movieSeriesId = req.params.id;
    const movieseries = await movieSeries.findOne({ _id: movieSeriesId });
    
    const userId = req.user.userId; // JWT'den çıkartılan user id

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        error: 'User not found',
      });
    }

    //kullanıcının favori film listesinde filmin id'sini arar
    const userIndex = user.favoriteMovieSeries.indexOf(movieSeriesId);

    //Eğer favori dizisinde ekli değilse -1 gönderir, eğer -1 ise if'in içine
    if (userIndex === -1) {
      // Film favori listesinde değilse, favorilere ekle
      user.favoriteMovieSeries.push(movieSeriesId);
    } else {
      // Film favori listesindeyse, favorilerden çıkar
      user.favoriteMovieSeries.splice(userIndex, 1);
    }

    await user.save();

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};
