const express = require('express');
const commentsController = require('../controllers/commentsController');
const Middlewares = require('../Middlewares/authMiddleware')

const router = express.Router();

router.route('/:id/CreateComment').post(commentsController.CreateComment); //http://localhost:5000/movieSeries/:id/comments
router.route('/:id/deleteComment').post(Middlewares.authenticateToken,commentsController.deleteComment); //http://localhost:5000/movieSeries/:id/comments/delete
router.route('/:id').get(commentsController.getComment); //http://localhost:5000/comments/:id (Yorum id)
router.route('/:id/comments').get(commentsController.getAllComments); //http://localhost:5000/comments/:id/comments (Filmin id)
router.route('/:id/averagerating').get(commentsController.calculateAverageRating); //http://localhost:5000/comments/:id/averagerating


module.exports = router;