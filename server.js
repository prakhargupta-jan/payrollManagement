const dotenv = require('dotenv')
dotenv.config({path: './config.env'});

const db = require('./db')
const app = require('./app');


const server = app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));