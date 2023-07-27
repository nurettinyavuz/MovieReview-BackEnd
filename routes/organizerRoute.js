const express = require('express');
const authController = require('../controllers/authController');
const organizationController = require('../controllers/organizationController');


const router = express.Router();


router.route('/:id').get(organizationController.getOrganizer);//http://localhost:5000/organizer/:id
router.route('/login').post(organizationController.loginOrganizer);//http://localhost:5000/organizer/login
router.route('/organizerRegister').post(organizationController.createOrganizer);//http://localhost:5000/organizer/organizationRegister

module.exports = router;