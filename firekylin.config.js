const {
  FK_DB_MODE,
  FK_DB_HOST,
  POSTGRES_HOST,
  FK_DB_DATABASE,
  POSTGRES_DATABASE,
  FK_DB_USER,
  POSTGRES_USER,
  FK_DB_PASSWORD,
  POSTGRES_PASSWORD,
  FK_DB_PORT,
  FK_DB_PREFIX,
} = process.env;

module.exports = {
  plugins: [
    require('firekylin-plugin-comment-import'),
    require('firekylin-plugin-friend-links'),
    require('firekylin-plugin-say'),
    require('firekylin-plugin-markdown-route'),
  ],
  widgets: [
    './widgets/index.js'
  ],
  "server": {
    "host": "0.0.0.0",
    "port": 8360,
    "proxy": true
  },
  "database": {
    "type": FK_DB_MODE,
    "host": FK_DB_HOST,
    "database": FK_DB_DATABASE,
    "user": FK_DB_USER,
    "password": FK_DB_PASSWORD,
    "port": FK_DB_PORT,
    "prefix": FK_DB_PREFIX,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    }
  }
};

// Firekylin marketplace plugin imports (for Vercel bundling)
require('firekylin-plugin-ai-provider-openai');
// End Firekylin marketplace plugin imports
