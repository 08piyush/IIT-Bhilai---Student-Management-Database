const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'studentDB',
  password: 'mdsind1409',
  port: 5432,
});
module.exports ={
    pool} ;