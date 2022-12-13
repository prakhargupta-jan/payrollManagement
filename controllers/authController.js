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
    data = await db.query('SELECT UID, passwd FROM users WHERE UID=$1', [req.body.UID]);
    if (data.rows.length == 0) {
        next(new AppError(404, 'No user found with the associated User ID'));           // fix UID enum vulnerability later
    }
    let compRes = await bcrypt.compare(req.body.password, data.rows[0].passwd);
    if (!compRes) {
        next(new AppError(401, 'Wrong Password provided'))
    }
    const token = jwt.sign({uid: req.body.UID}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    res.cookie('jwt', token);
    res.status(200).json({
        status: 'Success',
        data: 'Successfully Logged In'
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const token = req.cookies['jwt'];
    if (!token) {
        return next( new AppError(403, 'Please login first.'));
    }
    const result = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await db.query('SELECT * FROM USERS WHERE UID=$1', [result.uid]);
    if (user.rows.length == 0)
        return next(new AppError(402, 'Invalid token provided, Please retry logging in'));
    req.user = user.rows[0];
    next();
})

exports.restrictTo = (...roles) => (req, res, next) => {
    if (roles.includes(req.user.role))
        return next();
    return next(new AppError(403, 'Unauthorized Route'));
}

exports.updatePassword = catchAsync(async (req, res, next) => {
    if (!req.body.oldpassword || !req.body.newpassword)
      return next(new AppError(400, 'Please a suitable oldpassword and newpassword'));
    console.log(req.body.oldpassword);
    const user = (await db.query('SELECT * FROM users WHERE UID=$1', [req.user.uid])).rows[0];
    console.log(user);
    const result = await bcrypt.compare(req.body.oldpassword, user.passwd);
    console.log(result);
    if (result) {
        return next(new AppError('old password doesn\'t match with actual password'));
    }
    const encPassword = await bcrypt.hash(req.body.newpassword, 8);
    req.user.uid
    const data = await db.query('UPDATE users SET passwd=$1 WHERE UID=$2;', [encPassword, req.user.uid])
    res.status(200).json({
        status: 'success',
        data: data
    })
  })