'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { build } = require('firekylin/lib/vercel-static');

const projectPath = process.cwd();
const outputPath = build(projectPath);

fs.cpSync(
  path.join(projectPath, 'static'),
  outputPath,
  {
    recursive: true,
    force: true,
  }
);