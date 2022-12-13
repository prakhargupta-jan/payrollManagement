const catchAsync = require("../utils/catchAsync");
const db = require('../db');
const AppError = require("../utils/appError");

exports.getAssignmentEmpl = catchAsync(async (req, res, next) => {
    const queryString = `SELECT * FROM assignHistory WHERE eid=${uid}`;
    const data = await db.query(queryString);
    res.status(200).json({
        status: 'success',
        data: data.rows
    })
})

exports.updateAssignmentStatus = catchAsync(async (req, res, next) => {
    if (!req.body.status || !req.body.aid)
        next(new AppError(400, 'Please provide a suitable status and Assignment ID to udate the assignment'))
    await db.query(`UPDATE assignHitory SET assgnStatus='$1' WHERE aid='$2`, req.body.status, req.body.aid);
    res.status(200).json({
        status: 'success',
    })
})

exports.getAssignments = catchAsync(async (req, res, next) => {
    const data = await db.query('SELECT * FROM assignHistory');
    res.status(200).json({
        status: 'success',
    })
})

exports.postAssignment = catchAsync(async (req, res, next) => {
    const data = await db.query('INSERT INTO assignHistory(EID, assgnName, assgnDesc, assgnStatus, fromDate, toDate) values ()', req.body.name, req.body.description, req.body.status, req.body.from, req.body.to);

    res.staus(200).json({
        status: 'success',
        data
    })
})

exports.getAssignment = catchAsync(async (req, res, next) => {
    const data = await db.query('SELECT * FROM assignHistory WHERE aid=\'$1\'', req.params.aid);
    res.status(200).json({
        status: 'success',
        data
    })
})

exports.deleteAssignment = catchAsync(async (req, res, next) => {
    const data = await db.query('DELETE FROM assignHistory WHERE aid=\'$1\'', req.params.aid);
    res.status(200).json({
        status: 'success',
        data
    })
})

exports.updateAssignment = catchAsync(async (req, res, next) => {
    let queryString = 'UPDATE assignHistory SET '
    for (x in req.body) {
        queryString+= `${x}=${req.body[x]},`;
    }
    queryString = queryString.slize(0, queryString.length-1);
    const data = await db.query(queryString + ' WHERE aid=\'$1\'', req.params.aid);
    res.status(200).json({
        status: 'success',
        data
    })
})
