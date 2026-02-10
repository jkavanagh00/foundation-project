#!/usr/bin/env node
/** @format */

require('dotenv').config();
const knex = require('knex');
const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

async function migrate() {
  try {
    console.log(`Running migrations for ${environment} environment...`);
    await db.migrate.latest();
    console.log('✅ Migrations completed');
    
    console.log('Running seeds...');
    await db.seed.run();
    console.log('✅ Seeds completed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
