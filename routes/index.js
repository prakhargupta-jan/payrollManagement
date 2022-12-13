const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const userRoutes = require('./userRoutes')
const db = require('../db')
const pg = require('pg')
const { createUser } = require('../controllers/userController')

const routes = app => {
    app.use('/api/v1/users', userRoutes);
    // app.use('api/v1/deprecationSystem', protect, deprecationSystemRoutes  )
    // app.post('/superhiddenroute/createAdmin', createUser('admin'))

    app.all('*', (req, res, next) => {
        const error = new AppError(404, 'Route not found')
        next(error);
    });
}

module.exports = routes;