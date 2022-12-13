const {Router} = require('express')
const {restrictTo, protect} = require('../controllers/authController')
const {checkAttendance, getAttendances, getAttendancesByDate, markAttendance} = require('../controllers/receiptController');
const attRoutes = Router()

attRoutes.use(protect)


// user
attRoutes.route('/user').get(getReceipts)
attRoutes.route('/user/:date').get(getReceiptByDate);

// manager and admin Routes
attRoutes.use(restrictTo('manager', 'admin'))
attRoutes.route('/manager').get(getReceiptsAll('employee'))
attRoutes.route('/manager/:uid').get(getReceiptUser('employee'));

// admin Routes
attRoutes.use(restrictTo('admin'));
attRoutes.route('/admin').get(getReceiptAll('employee', 'manager'));
attRoutes.route('/admin/:uid').get(getReceiptUser('employee', 'manager'))

module.exports = attRoutes;