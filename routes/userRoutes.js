// const {Router} = require('express')
// const {login, restrictTo, protect} = require('../controllers/authController')

// const userRoutes = Router()

// userRoutes.route('/login').post(login);

// userRoutes.use(protect, restrictTo('admin', 'manager'))

// userRoutes.route('/manager').post(createUser).get(getUsers);
// userRoutes.route('/manager/:uid').patch(updateUser).delete(deleteUser);

// userRoutes.use(restrictTo('admin'));

// userRoutes.route('/admin').post(createUser).get(getUsers)
// userRoutes.route('/admin/:uid').delete(deleteUser).patch(updateUser);

// module.exports = userRoutes;