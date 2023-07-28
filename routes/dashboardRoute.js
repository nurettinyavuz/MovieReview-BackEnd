const express = require('express');
const authController = require('../controllers/authController');
const organizationController = require('../controllers/organizationController');


const router = express.Router();

router.route('/organizations').get(organizationController.getAllOrganization);//http://localhost:5000/organization/organizations



module.exports = router;