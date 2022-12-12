const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const userRoutes = require('./userRoutes')
const db = require('../db')
const pg = require('pg')

const routes = app => {
    // app.use('/api/v1/users', userRoutes);
    // app.use('api/v1/deprecationSystem', protect, deprecationSystemRoutes  )
    app.get('/paygrades', catchAsync(async (req, res, next) => {
        const data = await (new pg.Pool()).query('SELECT * FROM paygrade')
        console.log(data);
        res.status(200).json(data)
    }))

    app.all('*', (req, res, next) => {
        const error = new AppError(404, 'Route not found')
        next(error);
    });
}

module.exports = routes;