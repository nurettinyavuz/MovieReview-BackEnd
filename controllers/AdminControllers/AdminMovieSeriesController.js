const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../../models/User');
const movieSeries = require('../../models/movieSeries');
const Comment = require('../../models/Comment');

exports.createMovieSeries = async (req, res) => {
  try {
    const movieseries = await movieSeries.create(req.body);
    const users = await User.find({ role: 'admin'});

    for (const user of users) {//user adlı değişken, users dizisinin bir elemanını temsil eder.
    
        if (user.role !== 'admin') {
          return res.status(400).json({
            status: 'fail',
            error: 'Bu işlem için yetkiniz yok',
          });
        }
      }

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

exports.updateMovieSeries = async (req, res) => {
  try {
    const movieSeriesId = req.params.id;
    const updateMovieSeriesData = req.body;
    const users = await User.find({ role: 'admin'});

    for (const user of users) {//user adlı değişken, users dizisinin bir elemanını temsil eder.
    
        if (user.role !== 'admin') {
          return res.status(400).json({
            status: 'fail',
            error: 'Bu işlem için yetkiniz yok',
          });
        }
      }
    const movieseries = await movieSeries.findByIdAndUpdate(
      movieSeriesId,
      updateMovieSeriesData,
      {
        new: true,
      }
    );
    if (!movieSeries) {
      res.status(400).json({
        status: 'fail',
        error: 'No movieSeries found',
      });
    }
    res.status(201).json({
      status: 'success',
      movieseries,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
};

exports.deleteMovieSeries = async (req, res) => {
  try {
    const movieSeriesId = req.params.id;
    const users = await User.find({ role: 'admin'});

    for (const user of users) {//user adlı değişken, users dizisinin bir elemanını temsil eder.
    
        if (user.role !== 'admin') {
          return res.status(400).json({
            status: 'fail',
            error: 'Bu işlem için yetkiniz yok',
          });
        }
      }
    const movieseries = await movieSeries.findByIdAndDelete(movieSeriesId);
    if (!movieseries) {
      res.status(400).json({
        status: 'fail',
        error: 'No movieSeries found',
      });
    }
    res.status(201).json({
      status: 'success',
      movieseries,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    });
  }
}

exports.bulkDeleteMovieSeries = async (req, res) => {
  try {
    const { movieSeriesIds } = req.body;
    const users = await User.find({ role: 'admin'});

    for (const user of users) {//user adlı değişken, users dizisinin bir elemanını temsil eder. 
        if (user.role !== 'admin') {
          return res.status(400).json({
            status: 'fail',
            error: 'Bu işlem için yetkiniz yok',
          });
        }
      }

    const deletedMovieSeries = await movieSeries.deleteMany({ _id: { $in: movieSeriesIds } });

    if (deletedMovieSeries.deletedCount === 0) {
      return res.status(404).json({
        status: 'fail',
        error: 'Hiç film serisi bulunamadı',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Film serileri başarıyla silindi',
      deletedMovieSeriesCount: deletedMovieSeries.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await movieSeries.find({ MovieOrSeries: 'Film' });
    if (!movies) {
      res.status(400).json({
        status: 'fail',
        error: 'No movies found',
      });
    }
    res.status(201).json({
      status: 'success',
      movies,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllSeries = async (req, res) => {
  try {
    const series = await movieSeries.find({ MovieOrSeries: 'Dizi' });
    if (!series) {
      res.status(400).json({
        status: 'fail',
        error: 'No series found',
      });
    }
    res.status(201).json({
      status: 'success',
      series,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
