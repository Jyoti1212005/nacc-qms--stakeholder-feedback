import pg from 'pg';
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function runMigration() {
  console.log('[Migration] Testing connection to Supabase PostgreSQL...');

  const connectionString = process.env.DATABASE_URL;
  const clientConfig = connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.PGHOST || 'db.gjvcacldwdwvelfxxsst.supabase.co',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
      };

  const client = new Client(clientConfig);

  try {
    await client.connect();
    console.log('[Migration] Connected to Supabase PostgreSQL successfully!');

    const schemaPath = path.resolve('supabase_schema.sql');
    console.log(`[Migration] Reading SQL schema from ${schemaPath}...`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[Migration] Executing supabase_schema.sql...');
    await client.query(sql);
    console.log('[Migration] Schema executed successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`[Migration] Found ${res.rows.length} tables in public schema:`);
    res.rows.forEach(r => console.log(` - ${r.table_name}`));

    await client.end();
    return true;
  } catch (err) {
    console.error('[Migration] Failed:', err.message);
    try { await client.end(); } catch (e) {}
    return false;
  }
}

runMigration().then(success => {
  process.exit(success ? 0 : 1);
});
