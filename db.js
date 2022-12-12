const pg = require('pg')

const pool = new pg.Pool()

exports.query = pool