const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(authController.createUser);//http://localhost:3000/users/register
router.route('/login').post(authController.loginUser);//http://localhost:3000/users/login
router.route('/organizerRegister').post(authController.createOrganizer);//http://localhost:3000/users/organizer
router.route('/organizer/organization').post(authController.createOrganizer);//http://localhost:3000/users/organizer/organization


module.exports = router;