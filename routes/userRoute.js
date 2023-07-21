const express = require('express');
const authController = require('../controllers/authController');
const organizationController = require('../controllers/organizationController');


const router = express.Router();

router.route('/register').post(authController.createUser);//http://localhost:5000/users/register
router.route('/login').post(authController.loginUser);//http://localhost:5000/users/login
router.route('/organizer/login').post(organizationController.loginOrganizer);//http://localhost:5000/users/organizer/login
router.route('/organizerRegister').post(organizationController.createOrganizer);//http://localhost:5000/users/organizerRegister
router.route('/organizationRegister').post(organizationController.createOrganization);//http://localhost:5000/users/organizer/organization
router.route('/:id').get(authController.getUser);
router.route('/organizer/:id').get(organizationController.getOrganizer);
router.route('/organization/:id').get(organizationController.getOrganization);
router.route('/').get(organizationController.getAllOrganization);



module.exports = router;