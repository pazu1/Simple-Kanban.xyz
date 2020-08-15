const Pool = require("pg").Pool;
const pgp = require("pg-promise")();

const connection = {
    user: "pazu",
    password: "testPW",
    database: "kanban_test",
    host: "localhost",
    port: 5432,
};

const pool = new Pool(connection);
const pgpPool = pgp(connection);

module.exports = { pool: pool, pgpPool: pgpPool };
