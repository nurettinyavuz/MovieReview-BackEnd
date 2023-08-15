const express = require('express');
const movieSeriesController = require('../controllers/movieSeriesController');

const router = express.Router();

router.route('/movieSeries').get(movieSeriesController.getAllMovieSeries); //http://localhost:5000/movieSeries/movieSeries?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('/:id/comments').post(movieSeriesController.movieSeriesComment); //http://localhost:5000/movieSeries/:id/comments
router.route('/createMovieSeries').post(movieSeriesController.createMovieSeries); //http://localhost:5000/movieSeries/createMovieSeries

module.exports = router;
