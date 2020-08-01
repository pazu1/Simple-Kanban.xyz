const Pool = require("pg").Pool;

const pool = new Pool({
    user: "pazu",
    password: "testPW",
    database: "kanban_test",
    host: "localhost",
    port: 5432,
});

module.exports = pool;
