const catchAsync = require("../utils/catchAsync");
const db = require('../db')

exports.getReceipts = catchAsync(async (req, res, next) => {
    const data = await db.query('SELECT * FROM receiptHistory WHERE eid=\'$1\'', [req.user.uid]);
    res.status(200).json({
        status: 'success',
        data
    })
})

exports.getReceiptByDate = catchAsync(async (req, res, next) => {
    const data = await db.query('SELECT * FROM receiptHistory WHERE eid=\'$1\' AND receiptdate=\'$2\'', [req.user.uid, req.params.date]);
    res.status(200).json({
        status: 'success',
        data
    })
})

exports.getReceiptsAll = (...roles) => catchAsync(async (req, res, next) => {
    let data
    if (roles.length == 1)
        data = await db.query('SELECT * FROM receiptHistory LEFT JOIN users on users.uid=receiptHistory.eid WHERE users.role=\'$1\'', ['employee']);
    else
        data = await db.query('SELECT * FROM receiptHistory LEFT JOIN users on users.uid=receiptHistory.eid WHERE users.role=\'$1\' OR usesr.role=\'$2\'', ['employee', 'manager']);
    res.status(200).json({
        status: 'success',
        data
    })
})

exports.getReceiptsAll = (...roles) => catchAsync(async (req, res, next) => {
    let data
    if (roles.length == 1)
        data = await db.query('SELECT * FROM receiptHistory LEFT JOIN users on users.uid=receiptHistory.eid WHERE users.role=\'$1\' AND users.uid=$2', ['employee', req.params.uid]);
    else
        data = await db.query('SELECT * FROM receiptHistory LEFT JOIN users on users.uid=receiptHistory.eid WHERE (users.role=\'$1\' OR users.role=\'$2\') AND users.uid=\'$3\'', ['employee', 'manager', req.params.uid]);
    res.status(200).json({
        status: 'success',
        data
    })
})
