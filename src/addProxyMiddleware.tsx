// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://storage.googleapis.com",
      changeOrigin: true
    })
  );
};
