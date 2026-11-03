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
    "type": "postgresql",
    "host": POSTGRES_HOST,
    "database": POSTGRES_DATABASE,
    "user": POSTGRES_USER,
    "password": POSTGRES_PASSWORD,
    "port": "5432",
    "prefix": "fk_",
    ssl: {
      rejectUnauthorized: false,
    }
  }
};
