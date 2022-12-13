const catchAsync = require("../utils/catchAsync");
const db = require("../db");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");

exports.updateDeptManager = catchAsync(async (req, res, next) => {
    console.log(req.body);
    if (!req.body.name || !req.body.DID) {
        next(new AppError(400, 'Please provide a valid Departement ID and name'));
    }
    const t = await db.query('UPDATE department SET Dmanager=$1 WHERE DID=$2', [req.body.name, req.body.DID]);
    console.log(t);
    next();
})

exports.createUser = (role) => {
  return catchAsync(async (req, res, next) => {
    req.body.role = role || "employee";
    if (!req.body.name || !req.body.email || !req.body.password) {
      next(new AppError(400, "Please provide sufficient information"));
    }
    const hashedPswd = await bcrypt.hash(req.body.password, 8);
    const result = await db.query(
      "INSERT INTO USERS (name, role, passwd, contactNo, email, address, PID, DID) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        req.body.name,
        req.body.role,
        hashedPswd,
        req.body.contactNo,
        req.body.email,
        req.body.address,
        req.body.PID,
        req.body.DID,
      ]
    );
    delete result.rows[0].passwd;

    res.status(200).json({
      status: "success",
      data: result,
    });
  });
};

exports.getUsers = (...roles) => catchAsync( async (req, res, next) => {
  let queryString = `SELECT * FROM users WHERE role='${roles[0]}'`;
  for (let i = 1; i < roles.length; i++) {
    queryString+=` OR role='${roles[i]}'`;
  }
  queryString+=';'
  const data = await db.query(queryString);

  res.status(200).json({
    status: 'success',
    results: data.length,
    users: data
  })
})

exports.getUser = (...roles) => catchAsync( async (req, res, next) => {
  let queryString = `SELECT * FROM users WHERE uid=${req.params.uid} AND  (role='${roles[0]}'`;
  for (let i = 1; i < roles.length; i++) {
    queryString+=`OR role='${roles[i]}'`;
  }
  queryString+=');';
  const data = await db.query(queryString);
  if (data.rows.length == 0)
    return next(new AppError(404, 'No user associated with the given User ID found'));
  res.status(200).json({
    status: 'success',
    user: data
  })

})

exports.deleteUser = (...roles) => catchAsync(async (req, res, next) => {
  let queryString = `DELETE FROM users WHERE uid=${req.params.uid} AND (role='${roles[0]}'`;
  for (let i = 1; i < roles.length; i++) {
    queryString+=`OR role='${roles[i]}'`;
  }
  queryString+=');';
  const data = await db.query(queryString);
          // First check if the user exist
  res.status(200).json({
    status: 'success',
    users: data
  })
})

exports.updateUser = (...roles) => catchAsync(async (req, res, next) => {
  ['passwd', 'uid', 'role'].forEach(x => {
    if (req.body[x])
      delete req.body[x];
  })
  let queryString = `UPDATE users SET `;
  let a = true;
  for (x in req.body) {
    if (a){
      queryString += `${x}=${req.body[x]}`;
      a = false;
    }
    queryString +=`, ${x}=${req.body[x]}`;
  }
  queryString += `WHERE UID = ${req.params.uid} AND (role = '${roles[0]}'`

  for (let i = 1; i < roles.length; i++) {
    queryString+=`OR role=${roles[i]}`;
  }
  queryString+=');';

  const data = await db.query(queryString);
          // First check if the user exist
  res.status(200).json({
    status: 'success',
    users: data
  })
})

