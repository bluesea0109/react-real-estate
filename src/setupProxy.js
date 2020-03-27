const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: process.env.REACT_APP_DEV_PROXY,
      changeOrigin: true,
    })
  );
};
