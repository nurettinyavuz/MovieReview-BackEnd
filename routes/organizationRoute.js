const express = require('express');
const organizationController = require('../controllers/organizationController');


const router = express.Router();

router.route('/organizations').get(organizationController.getAllOrganization);http://localhost:5000/organization/organizations?search=ya
router.route('/:id').get(organizationController.getOrganization);//http://localhost:5000/organization/:id
router.route('/createOrganization').post(organizationController.createOrganization);//http://localhost:5000/organization/organizationRegister


module.exports = router;