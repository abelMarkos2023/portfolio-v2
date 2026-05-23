import { getDb } from './lib/db';

async function test() {
  try {
    const db = await getDb();
    console.log('Database initialized successfully');
    const results = db.exec("SELECT 1 + 1 as sum");
    console.log('Test query result:', results[0].values[0][0]);
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

test();
