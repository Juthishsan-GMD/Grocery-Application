const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initDb = async () => {
  try {
    console.log('--- Database Initialization Starting ---');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL by semicolons to execute as individual commands (basic approach)
    // Note: This won't handle complex blocks like DO/BEGIN/END perfectly, 
    // so we'll run the whole script as one command if possible, but pg usually handles it.
    await pool.query(schemaSql);

    console.log('--- Database Initialization SUCCESSFUL ---');
    process.exit(0);
  } catch (err) {
    console.error('--- Database Initialization FAILED ---');
    console.error(err);
    process.exit(1);
  }
};

initDb();
