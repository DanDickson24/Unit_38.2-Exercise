/** Database config for database. */


// const { Client } = require("pg");
// const {DB_URI} = require("./config");

// let db = new Client({
//   connectionString: DB_URI
// });

// db.connect();


// module.exports = db;


const { Client } = require("pg");
const { DB_URI } = require("./config");
const client = new Client({
  user: "test",
  password: "test123",
  host: "localhost",
  port: 5432,
  database: "books"
});

client.connect();

module.exports = client;