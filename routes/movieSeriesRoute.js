const express = require('express');
const movieSeriesController = require('../controllers/movieSeriesController');

const router = express.Router();

router.route('/movieSeries').get(movieSeriesController.getAllMovieSeries); //http://localhost:5000/movieSeries/organizations?search=ya
router.route('/:id').get(movieSeriesController.getMovieSeries); //http://localhost:5000/organization/:id
router.route('/createMovieSeries').post(movieSeriesController.createMovieSeries); //http://localhost:5000/organization/organizationRegister

module.exports = router;
