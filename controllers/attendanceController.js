const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const db = require('../db');
const { json } = require("express");

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

exports.markAttendance = catchAsync(async (req, res, next) => {
    let status = 'present';
    if (req.body.presencestatus)
        status = req.body.presencestatus;
    if (!['present', 'absent', 'pl', 'cl', 'sl'].includes(status) )
        return next(new AppError(400, 'please provide a valid status which can be absent, present, pl, cl or sl'));
    await db.query(`INSERT INTO attendance(EID, attend, status) VALUES (${req.user.uid}, ${getDate(Date.now())}, ${status})`);
    res.status(200).json({
        status: 'success',
        attendanceStatus: status
    })
})

exports.checkAttendance = catchAsync(async (req, res, next) => {
    const status = await db.query(`SELECT * FROM attendance WHERE eid=${req.user.uid} AND attend=${getDate(Date.now())}`);
    res.status(200).json({
        status: 'success',
        data: status
    })
})

exports.getAttendances = (...roles) => catchAsync(async (req, res, next) => {
    let queryString;
    if (roles.length == 2)
        queryString = `SELECT * FROM attendance LEFT OUTER JOIN users ON attendance.eid = user.uid WHERE user.role='employee' OR user.role='manager'`;
    else
        queryString = `SELECT * FROM attendance LEFT OUTER JOIN users ON attendance.eid = user.uid WHERE user.role='employee'`;
    const data = await db.query(queryString);
    res.status(200).json({
        status: 'success',
        data
    })
    
})

exports.getAttendancesByDate = (...roles) => catchAsync(async (req, res, next) => {
    let queryString;
    if (roles.length == 2)
        queryString = `SELECT * FROM attendance LEFT OUTER JOIN users ON attendance.eid = user.uid WHERE (user.role='employee' OR user.role='manager') AND attend=${req.params.date}`;
    else
        queryString = `SELECT * FROM attendance LEFT OUTER JOIN users ON attendance.eid = user.uid WHERE user.role='employee' AND attend=${req.params.date}`;
    const data = await db.query(queryString);
    res.status(200).json({
        status: 'success',
        data
    })
})