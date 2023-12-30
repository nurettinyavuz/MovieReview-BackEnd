const express = require('express');
const movieSeriesController = require('../../controllers/movieSeriesController');
const AdminMovieSeriesController = require('../../controllers/AdminControllers/AdminMovieSeriesController');

const router = express.Router();

router.route('/Search/MovieSeries').get(movieSeriesController.getSearchMovieSeries); //http://localhost:5000/movieSeries/Search/MovieSeries?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('/Admin/createMovieSeries').post(AdminMovieSeriesController.createMovieSeries); //http://localhost:5000/AdminMovieseries/Admin/createMovieSeries
router.route('/admin/UpdateMovieSeries/:id').put(AdminMovieSeriesController.updateMovieSeries); //http://localhost:5000/AdminMovieseries/admin/UpdateMovieSeries/:id
router.route('/MovieSeries/AllMovieSeries').get(movieSeriesController.getAllMovieSeries);//http://localhost:5000/AdminMovieseries/MovieSeries/AllMovieSeries?page=1
router.route('/admin/filmler').get(AdminMovieSeriesController.getAllMovies); //http://localhost:5000/AdminMovieseries/admin/filmler
router.route('/admin/diziler').get(AdminMovieSeriesController.getAllSeries); //http://localhost:5000/AdminMovieseries/admin/diziler

module.exports = router;