var mysql = require('mysql');

// Used to connect the DB via .env
const dotenv = require('dotenv')
dotenv.config({path: './.env'})

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

db.connect(function(err) {
    if (err) throw err;
    console.log("MySQL connected");
});

module.exports = db;