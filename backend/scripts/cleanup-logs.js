const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '../logs');
const MAX_AGE_DAYS = 14;

function cleanupOldLogs() {
  const now = Date.now();
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  if (!fs.existsSync(LOGS_DIR)) {
    console.log('Logs directory does not exist, creating it...');
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    return;
  }

  fs.readdirSync(LOGS_DIR).forEach(file => {
    const filePath = path.join(LOGS_DIR, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtime.getTime();

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old log file: ${file}`);
    }
  });
}

cleanupOldLogs();