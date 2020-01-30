const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'https://gabby-alf-voucher-development.eks.rmcloud.com/',
      changeOrigin: true,
    })
  );
};
