const os = require('os');
const path = require('path');
const Application = require('thinkjs');
const Loader = require('thinkjs/lib/loader');
const fkPath = require.resolve('firekylin');

module.exports = function(req, res) {
  const app = new Application({
    ROOT_PATH: fkPath,
    APP_PATH: path.join(fkPath, 'src'),
    VIEW_PATH: path.join(fkPath, 'view'),
    RUNTIME_PATH: os.tmpdir(),
    proxy: true, // use proxy
    env: 'vercel',
    external: {
      package: path.join(fkPath, 'package.json'),
      qiniu: path.join(__dirname, 'node_modules/qiniu/qiniu'),
      static: {
        www: path.join(fkPath, 'www')
      }
    }
  });

  const loader = new Loader(app.options);
  loader.loadAll('worker');

  const ready = think.beforeStartServer().catch(err => {
    think.logger.error(err);
  }).then(() => {
    think.app.emit('appReady');
  });
  
  return ready.then(() => {
    const callback = think.app.callback();
    return callback(req, res);
  });
};