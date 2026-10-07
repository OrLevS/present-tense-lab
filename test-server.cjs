// Starts a second copy of the app for testing (port 5175, separate demo data). Your real data/db.json is not touched.
process.env.PORT = '5175';
process.env.DEMO_DATA = process.env.DEMO_DATA ?? '0'; // set DEMO_DATA=1 for the 3 demo students
process.env.DATA_DIR = require('path').join(require('os').tmpdir(), 'present-lab-test-data');
require('fs').rmSync(process.env.DATA_DIR, { recursive: true, force: true });
import('./server/server.js');
