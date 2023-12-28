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
  