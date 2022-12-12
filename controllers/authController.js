const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const bcrypt = require('bcrypt');
const db = require('../db');
const AppError = require('../utils/appError');
const {promisify} = require('util')

exports.login = catchAsync(async (req, res, next) => {
    if (!req.body.UID || !req.body.password || !req.body.passwordConfirm)
        return next(new AppError(400, 'Please provide User ID, password and password confirm'));
    if (req.body.password != req.body.passwordConfirm)
        return next(new AppError(400, 'password and password confirm do not match'));
    data = db.query('SELECT UID, password FROM users WHERE UID=$1', [req.body.UID]);
    if (data.rows.length == 0) {
        next(new AppError(404, 'No user found with the associated User ID'));           // fix UID enum vulnerability later
    }
    let compRes = bcrypt.compare(req.body.password, data.rows[0].password);
    if (!compRes) {
        next(new AppError(401, 'Wrong Password provided'))
    }
    const token = jwt.sign(UID, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    res.cookie('jwt', token);
    res.status(200).json({
        status: 'Success',
        data: 'Successfully Logged In'
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    const token = req.cookies['jwt'];
    if (!token) {
        return next( new AppError(403, 'Please login first.'));
    }
    const result = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(result);
    const user = await db.query('SELECT * FROM USERS WHERE ID=$1', [user.id]);
})

exports.restrictTo = (...roles) => (req, res, next) => {
    if (roles.includes(req.user.role))
        return next();
    return next(new AppError(403, 'Unauthorized Route'));
}