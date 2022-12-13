const {Router} = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {deleteAssignment, getAssignment, getAssignmentEmpl, getAssignments, postAssignment, updateAssignment, updateAssignmentStatus} = require('../controllers/assignmentController')

const assignmentRouter = Router();

assignmentRouter.use(protect);

assignmentRouter.route('/employee').patch(updateAssignmentStatus).get(getAssignmentEmpl);

assignmentRouter.use(restrictTo('admin', 'employee'));
assignmentRouter.route('/').get(getAssignments).post(postAssignment)
assignmentRouter.route('/:aid').get(getAssignment).delete(deleteAssignment).patch(updateAssignment);

module.exports = assignmentRouter