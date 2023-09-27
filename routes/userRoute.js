const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require ('../Middlewares/authMiddleware');


const router = express.Router();


router.route('/:id').get(authController.getUser);
router.route('/register').post(authController.createUser);//http://localhost:5000/users/register
router.route('/login').post(authController.loginUser);//http://localhost:5000/users/login
router.route('/logout').post(authController.logoutUser);//http://localhost:5000/users/logout
router.route('/userLevel').post(authController.userLevel);
//router.route('/extract-cookie').get(authMiddleware.authenticateToken,authController.extractCookie);//http://localhost:5000/users/extract-cookie
//router.route('/dashboard').get(authMiddleware.authenticateToken, authController.getDashboardPage);

module.exports = router;