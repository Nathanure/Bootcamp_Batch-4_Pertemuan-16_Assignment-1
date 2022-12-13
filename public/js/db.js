// Import third-party module to use PostgreSQL in JavaScript
const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "Saddha78",
    database: "db_contacts",
    host: "localhost",
    port: 5432
})

// Exporting db function to main app.js
module.exports = pool