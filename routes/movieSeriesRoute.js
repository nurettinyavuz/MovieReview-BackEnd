const express = require('express');
const movieSeriesController = require('../controllers/movieSeriesController');
const authMiddleware = require('../Middlewares/authMiddleware')

const router = express.Router();

router.route('/Search/MovieSeries').get(movieSeriesController.getSearchMovieSeries); //http://localhost:5000/movieSeries/Search/MovieSeries?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('/current/CurrentMovies').get(movieSeriesController.CurrentMovies); //http://localhost:5000/movieSeries/current/CurrentMovies
router.route('/MovieSeries/AllMovieSeries').get(movieSeriesController.getAllMovieSeries);//http://localhost:5000/movieSeries/MovieSeries/AllMovieSeries
router.route('/:id/favorite/:id').post(authMiddleware.authenticateToken,movieSeriesController.favoriteMovieSeries);//http://localhost:5000/movieSeries/:movieSeriesId/favorite/:userId


module.exports = router; 
