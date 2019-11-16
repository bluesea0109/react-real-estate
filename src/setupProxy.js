const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://ec2-34-229-219-96.compute-1.amazonaws.com:3117/',
      // target: 'http://alf-voucher-dev-340916393.us-east-1.elb.amazonaws.com/',
      changeOrigin: true,
    })
  );
};
