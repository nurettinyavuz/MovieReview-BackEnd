const express = require('express');
const authMiddleware = require('../Middlewares/authMiddleware')
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router.route('/:movieSeriesId/CreateComment').post(authMiddleware.authenticateToken,commentsController.CreateComment); //http://localhost:5000/comments/:id/CreateComment (Filmin id)
router.route('/:id/deleteComment/:commentId').delete(authMiddleware.authenticateToken,commentsController.deleteComment);//http://localhost:5000/comments/:id/deleteComment/:commentId
router.route('/:id/updateComment/:commentId').put(commentsController.updateComment);//http://localhost:5000/comments/:id/updateComment/:commentId
router.route('/rating/TopMovie').get(commentsController.TopMovie); //http://localhost:5000/comments/rating/TopMovie 
router.route('/:id').get(commentsController.getComment); //http://localhost:5000/comments/:id (Yorum id)
router.route('/:id/user').get(commentsController.getUserComment); //http://localhost:5000/comments/:id/user (UserID)
router.route('/:id/comments').get(commentsController.getAllComments); //http://localhost:5000/comments/:id/comments (Filmin id)
//router.route('/:id/averagerating').get(commentsController.calculateAverageRating); //http://localhost:5000/comments/:id/averagerating (Filmin id)
router.route('/:id/Like').put(authMiddleware.authenticateToken, commentsController.Like); //http://localhost:5000/comments/:id/Like (Yorum id)
router.route('/:id/Dislike').put(authMiddleware.authenticateToken,commentsController.Dislike); //http://localhost:5000/comments/:id/Dislike (Yorum id)

 
module.exports = router;