// npm run reset-db — rebuilds data/db.json from the demo seed (erases all real data!).
import { reset, DB_FILE } from './db.js';
reset();
console.log('Database reset to demo data →', DB_FILE);
