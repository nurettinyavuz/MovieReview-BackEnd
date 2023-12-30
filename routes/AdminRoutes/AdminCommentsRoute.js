const express = require('express');
const commentsController = require('../../controllers/commentsController');
const AdminCommentController = require('../../controllers/AdminControllers/AdminCommentController');

const router = express.Router();

router.route('/Admin/DeleteComment').delete(commentsController.deleteComment); //http://localhost:5000/AdminComments/Admin/DeleteComment

module.exports = router;
