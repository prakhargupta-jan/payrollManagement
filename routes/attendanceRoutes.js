const {Router} = require('express')
const {login, restrictTo, protect} = require('../controllers/authController')

const attRoutes = Router()


app.route('/').get(protect, restrictTo('admin', 'manager'), checkAttendance);

app.use(protect, restrictTo('employee'))

attRoutes.route('/:uid').post(postPresence).get(checkAttendance);

attRoutes.route('/admin').post(createUser).get(getUsers)
attRoutes.route('/admin/:uid').delete(deleteUser).patch(updateUser);

module.exports = attRoutes;