const express = require('express');
const movieSeriesController = require('../../controllers/movieSeriesController');
const AdminMovieSeriesController = require('../../controllers/AdminControllers/AdminMovieSeriesController');
const authMiddleware = require('../../Middlewares/authMiddleware')

const router = express.Router();

router.route('/Search/MovieSeries').get(movieSeriesController.getSearchMovieSeries); //http://localhost:5000/movieSeries/Search/MovieSeries?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/movieSeries/:id
router.route('/admin/createMovieSeries').post(authMiddleware.checkAdminAuthorization,AdminMovieSeriesController.createMovieSeries); //http://localhost:5000/AdminMovieseries/Admin/createMovieSeries
router.route('/admin/UpdateMovieSeries/:id').put(authMiddleware.checkAdminAuthorization,AdminMovieSeriesController.updateMovieSeries); //http://localhost:5000/AdminMovieseries/admin/UpdateMovieSeries/:id
router.route('/admin/DeleteMovieSeries/:id').delete(authMiddleware.checkAdminAuthorization,AdminMovieSeriesController.deleteMovieSeries); //http://localhost:5000/AdminMovieseries/admin/DeleteMovieSeries/:id
router.route('/MovieSeries/AllMovieSeries').get(movieSeriesController.getAllMovieSeries);//http://localhost:5000/AdminMovieseries/MovieSeries/AllMovieSeries
router.route('/admin/filmler').get(AdminMovieSeriesController.getAllMovies); //http://localhost:5000/AdminMovieseries/admin/filmler
router.route('/admin/diziler').get(AdminMovieSeriesController.getAllSeries); //http://localhost:5000/AdminMovieseries/admin/diziler

module.exports = router;