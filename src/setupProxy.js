const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://alf-voucher-dev-340916393.us-east-1.elb.amazonaws.com/',
      changeOrigin: true,
    })
  );
};
