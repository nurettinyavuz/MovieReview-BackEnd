const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../../models/User');
const movieSeries = require('../../models/movieSeries');
const Comment = require('../../models/Comment');

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
  } catch {
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
  } catch {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
