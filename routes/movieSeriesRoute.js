const express = require('express');
const movieSeriesController = require('../controllers/movieSeriesController');

const Middlewares = require('../Middlewares/authMiddleware')

const router = express.Router();

router.route('/Search/MovieSeries').get(movieSeriesController.getSearchMovieSeries); //http://localhost:5000/movieSeries/Search/SearchMovieSeries?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('/createMovieSeries').post(movieSeriesController.createMovieSeries); //http://localhost:5000/movieSeries/createMovieSeries
router.route('/current/CurrentMovies').get(movieSeriesController.CurrentMovies); //http://localhost:5000/movieSeries/current/CurrentMovies


module.exports = router; 
