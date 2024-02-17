const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require ('../Middlewares/authMiddleware');

const router = express.Router();

router.route('/:id').get(authController.getUser);
router.route('/Members/AllUsers').get(authController.getAllUsers);//http://localhost:5000/AdminUser/Admin/AllUsers
router.route('/register').post(authController.createUser);//http://localhost:5000/users/register
router.route('/login').post(authController.loginUser,authMiddleware.authenticateToken);//http://localhost:5000/users/login
router.route('/refreshToken').post(authController.refreshToken);//http://localhost:5000/users/refreshToken
router.route('/logout').post(authMiddleware.authenticateToken, authController.logoutUser);//http://localhost:5000/users/logout
router.route('/:id/favoritesMovieSeries').get(authMiddleware.authenticateToken,authController.getFavoriteMovieSeries);//http://localhost:5000/users/:id/favoritesMovieSeries

module.exports = router;