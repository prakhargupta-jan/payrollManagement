const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const db = require('../db')

const getDate = (date) => {
    day = date.getDate();
    month = date.getMonth()+1;
    year = date.getFullYear();
    if (month < 10)
        month = '0'+month;
    if (day < 10)
        day = '0' + day;
    return `${year}-${month}-${day}`;
}

exports.checkAttendance = catchAsync(async (req, res, next) => {
    let status = 'present';
    if (req.body.presencestatus)
        status = req.body.presencestatus;
    if (!['present', 'absent', 'pl', 'cl', 'sl'].includes(status) )
        return next(new AppError(400, 'please provide a valid status which can be absent, present, pl, cl or sl'));
    await db.query(`INSERT INTO attendance(EID, attend, status) VALUES (${req.user.uid}, ${getDate(Date.now())}, ${status})`)
})