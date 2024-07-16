// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app: { use: (arg0: string, arg1: unknown) => void; }) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://storage.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      onProxyRes: function(proxyRes: { headers: { [x: string]: string; }; }) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
    })
  );
};
