/** @format */

require('dotenv').config();

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DATABASE_HOST || "localhost",
      user: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD || "flipmaster",
      database: process.env.DATABASE_NAME || "flipmaster_game",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
