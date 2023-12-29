const express = require('express');
const movieSeriesController = require('../controllers/movieSeriesController');
const Middlewares = require('../Middlewares/authMiddleware')

const router = express.Router();

router.route('/Search/MovieSeries').get(movieSeriesController.getSearchMovieSeries); //http://localhost:5000/movieSeries/Search/MovieSeries?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('/current/CurrentMovies').get(movieSeriesController.CurrentMovies); //http://localhost:5000/movieSeries/current/CurrentMovies
router.route('/MovieSeries/AllMovieSeries').get(movieSeriesController.getAllMovieSeries);//http://localhost:5000/movieSeries/MovieSeries/AllMovieSeries?page=1

module.exports = router; 
