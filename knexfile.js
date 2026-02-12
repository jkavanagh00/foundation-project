/** @format */

require("dotenv").config();

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
      password: process.env.DATABASE_PASSWORD || "Ha@123456",
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
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
