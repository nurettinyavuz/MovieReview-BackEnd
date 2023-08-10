const express = require('express');
const authController = require('../controllers/authController');
const movieSeriesController = require('../controllers/movieSeriesController');

const router = express.Router();

router.route('/movieSeries').get(movieSeriesController.getAllMovieSeries); //http://localhost:5000/organization/organizations

module.exports = router;
