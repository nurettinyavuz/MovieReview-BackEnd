const express = require('express');
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../Middlewares/authMiddleware')

const router = express.Router();

router.route('/:id/CreateComment').post(commentsController.CreateComment); //http://localhost:5000/comments/:id/comments
router.route('/:id/deleteComment/:commentId').delete(commentsController.deleteComment);//http://localhost:5000/comments/:id/deleteComment/:commentId
router.route('/:id/updateComment/:commentId').put(commentsController.updateComment);//http://localhost:5000/comments/:id/updateComment/:commentId
router.route('/:id').get(commentsController.getComment); //http://localhost:5000/comments/:id (Yorum id)
router.route('/:id/comments').get(commentsController.getAllComments); //http://localhost:5000/comments/:id/comments (Filmin id)
router.route('/:id/averagerating').get(commentsController.calculateAverageRating); //http://localhost:5000/comments/:id/averagerating (Filmin id)
router.route('/:id/Like').post(commentsController.Like); //http://localhost:5000/comments/:id/LikeOrDislike (Yorum id)
router.route('/:id/Dislike').post(commentsController.Dislike); //http://localhost:5000/comments/:id/LikeOrDislike (Yorum id)


module.exports = router;