const express = require('express');
const authController = require('../controllers/authController');
const organizationController = require('../controllers/organizationController');


const router = express.Router();
/* 

router.route('/:id').get(organizationController.getAdmin);//http://localhost:5000/organizer/:id
router.route('/login').post(organizationController.loginAdmin);//http://localhost:5000/organizer/login
//router.route('/organizerRegister').post(organizationController.createOrganizer);//http://localhost:5000/organizer/organizationRegister
*/

module.exports = router;