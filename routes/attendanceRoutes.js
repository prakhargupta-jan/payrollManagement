const {Router} = require('express')
const {restrictTo, protect} = require('../controllers/authController')
const {checkAttendance, getAttendances, getAttendancesByDate, markAttendance} = require('../controllers/attendanceController');
const attRoutes = Router()

attRoutes.use(protect)

// employee specific
attRoutes.route('/').get(restrictTo('employee'), checkAttendance).post(restrictTo('employee'), markAttendance);

// admin and managerRoutes
attRoutes.use(restrictTo('manager', 'admin'))
attRoutes.route('/manager').get(getAttendances('employee'))
attRoutes.route('/manager/:date').get(getAttendancesByDate('employee'));

// admin specific
attRoutes.use(restrictTo('admin'));
attRoutes.route('/admin').get(getAttendances('employee', 'manager'))
attRoutes.route('/admin/:date').get(getAttendancesByDate('employee', 'manager'))


module.exports = attRoutes;