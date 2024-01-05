const express = require('express');
const commentsController = require('../../controllers/commentsController');
const AdminCommentController = require('../../controllers/AdminControllers/AdminCommentController');
const authMiddleware = require('../../Middlewares/authMiddleware')

const router = express.Router();

//router.route('/:id/deletecomment/:commentId').delete(authMiddleware.checkAdminAuthorization,AdminCommentController.AdminDeletedComment); //http://localhost:5000/AdminComments/:id/deletecomment/:commentId (FimId,commentId)

module.exports = router;
