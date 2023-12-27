const express = require('express');
const authController = require('../../controllers/authController');
const AdminUserController = require('../../controllers/AdminControllers/AdminUserController');

const router = express.Router();

router.route('/:id').get(authController.getUser);
router.route('/AllUsers').get(authController.getAllUser);

module.exports = router;
