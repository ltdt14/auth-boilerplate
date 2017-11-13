const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// load env vars if .env exists
if (fs.existsSync(path.join(__dirname, '../.env'))) dotenv.load();