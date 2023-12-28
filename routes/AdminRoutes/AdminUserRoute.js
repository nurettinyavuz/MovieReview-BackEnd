const express = require('express');
const authController = require('../../controllers/authController');
const AdminUserController = require('../../controllers/AdminControllers/AdminUserController');

const router = express.Router();

router.route('/:id').get(authController.getUser); //http://localhost:5000/AdminUser/:id
router.route('/Admin/AllUsers').get(authController.getAllUsers); //http://localhost:5000/AdminUser/Admin/AllUsers
router.route('/:id/deleteUser').delete(authController.deleteUser);//http://localhost:5000/AdminUser/:id/deleteUser (userId)
//router.route('/:id/updateUser').put(authController.updateUser);//http://localhost:5000/AdminUser/:id/updateUser (userId)

module.exports = router;
