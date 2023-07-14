const express = require('express');
const authController = require('../controllers/authController');
const organizationController = require('../controllers/organizationController');


const router = express.Router();

router.route('/register').post(authController.createUser);//http://localhost:3000/users/register
router.route('/login').post(authController.loginUser);//http://localhost:3000/users/login
router.route('/organizerRegister').post(organizationController.createOrganizer);//http://localhost:3000/users/organizerRegister
router.route('/organization').post(organizationController.createOrganization);//http://localhost:3000/users/organizer/organization
router.route('/:id').get(authController.getUser);


module.exports = router;