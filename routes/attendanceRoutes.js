const {Router} = require('express')
const {login, restrictTo, protect} = require('../controllers/authController')

const attRoutes = Router()

attRoutes.use(protect)

// employee specific
attRoutes.route('/').get(restrictTo('employee'), checkAttendance).post(restrictTo('employee'), markAttendance);

// admin and managerRoutes
attRoutes.use(restrictTo('manager', 'admin'))
attRoutes.route('/manager').get(getAttendances('employee'))
attRoutes.route('/manager/:date').get(getAttendanceByDate('employee'));

// admin specific
attRoutes.use(restrictTo('admin'));
attRoutes.route('/admin').get(getAttendances('employee', 'manager'))
attRoutes.route('/admin/:date').get(getAttendanceByDate('employee', 'manager'))


module.exports = attRoutes;