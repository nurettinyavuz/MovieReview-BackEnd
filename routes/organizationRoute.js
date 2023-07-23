const express = require('express');
const authController = require('../controllers/authController');
const organizationController = require('../controllers/organizationController');


const router = express.Router();

router.route('/organizations').get(organizationController.getAllOrganization);//http://localhost:5000/organization/organizations
router.route('/:id').get(organizationController.getOrganization);//http://localhost:5000/organization/:id
router.route('/organizationRegister').post(organizationController.createOrganization);//http://localhost:5000/organization/organizationRegister


module.exports = router;