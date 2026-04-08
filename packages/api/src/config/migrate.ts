import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { env } from './env.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const client = new pg.Client({ connectionString: env.databaseUrl });
  await client.connect();
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await client.query(sql);
  console.log('Migration complete');
  await client.end();
}

migrate().catch((err) => { console.error('Migration failed:', err); process.exit(1); });
