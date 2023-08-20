const express = require('express');
const commentsController = require('../controllers/commentsController');
const Middlewares = require('../Middlewares/authMiddleware')

const router = express.Router();

router.route('/:id/comments').post(commentsController.CreateComment); //http://localhost:5000/movieSeries/:id/comments
router.route('/:id/comments/delete').post(Middlewares.authenticateToken,commentsController.deleteComment); //http://localhost:5000/movieSeries/:id/comments/delete

module.exports = router;