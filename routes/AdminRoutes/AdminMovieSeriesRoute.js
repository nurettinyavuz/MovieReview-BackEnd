const express = require('express');
const movieSeriesController = require('../../controllers/movieSeriesController');
const AdminMovieSeriesController = require('../../controllers/AdminControllers/AdminMovieSeriesController');

const router = express.Router();

router.route('').get(movieSeriesController.getSearchMovieSeries); //http://localhost:5000/movieSeries/Search/MovieSeries?search=ya
router.route('').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('').post(movieSeriesController.createMovieSeries); //http://localhost:5000/movieSeries/createMovieSeries
router.route('').get(movieSeriesController.CurrentMovies); //http://localhost:5000/movieSeries/current/CurrentMovies

module.exports = router;