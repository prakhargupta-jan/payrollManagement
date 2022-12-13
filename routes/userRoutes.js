const {Router} = require('express')
const {login, restrictTo, protect, updatePassword} = require('../controllers/authController')
const { createUser, deleteUser, getUser, getUsers, updateDeptManager, updateUser} = require('../controllers/userController')

const userRoutes = Router()


userRoutes.route('/login').post(login);
userRoutes.use(protect);

userRoutes.route('/update-password').post(updatePassword)           // something is very wrong here
// Manager Routes
userRoutes.use(restrictTo('manager', 'admin'))
userRoutes.route('/manager').post(createUser('employee')).get(getUsers('employee'))

userRoutes.route('/manager/:uid').get(getUser('employee')).delete(deleteUser('employee')).patch(updateUser('employee'));

// Admin Routes
userRoutes.use(restrictTo('admin'));
userRoutes.route('/admin').get(getUsers('manager', 'employee'))

userRoutes.route('/admin/managers').get(getUsers('manager')).post(updateDeptManager, createUser('manager'));

userRoutes.route('/admin/:uid').get(getUser('manager', 'employee')).delete(deleteUser('manager', 'employee')).patch(updateUser('manager', 'employee'));

module.exports = userRoutes;