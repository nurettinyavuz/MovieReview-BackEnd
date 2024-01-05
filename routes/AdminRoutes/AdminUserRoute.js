const express = require('express');
const authController = require('../../controllers/authController');
const AdminUserController = require('../../controllers/AdminControllers/AdminUserController');
const authMiddleware = require('../../Middlewares/authMiddleware')

const router = express.Router();

router.route('/:id').get(authController.getUser); //http://localhost:5000/AdminUser/:id
router.route('/login').post(AdminUserController.loginAdmin); //http://localhost:5000/AdminUser/login
router.route('/Admin/AllUsers').get(authController.getAllUsers); //http://localhost:5000/AdminUser/Admin/AllUsers
router.route('/:id/deleteUser').delete(authMiddleware.checkAdminAuthorization,AdminUserController.deleteUser); //http://localhost:5000/AdminUser/:id/deleteUser (userId)
router.route('/:id/bannedUser').patch(authMiddleware.checkAdminAuthorization,AdminUserController.bannedUser); //http://localhost:5000/AdminUser/:id/bannedUser (userId)

module.exports = router;
