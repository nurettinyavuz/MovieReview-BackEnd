const express = require('express');
const authController = require('../controllers/authController');


const router = express.Router();


router.route('/:id').get(authController.getUser);
router.route('/register').post(authController.createUser);//http://localhost:5000/users/register
router.route('/login').post(authController.loginUser);//http://localhost:5000/users/login

module.exports = router;