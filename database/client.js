
const pg = require('pg');

const Client = new pg.Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DB,
    port: process.env.DBPORT,
    host: process.env.DBHOST,
    ssl: true
  });



// queries.getUser = (id) => `SELECT * FROM ${process.env.userTable} WHERE id=${id};`;

module.exports = Client;
