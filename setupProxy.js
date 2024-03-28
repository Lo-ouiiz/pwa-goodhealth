// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // L'API que vous souhaitez appeler
    createProxyMiddleware({
      target: 'https://api.louise-mendiburu.fr/api-app-portfolio/login.php', // L'URL de votre API
      changeOrigin: true,
      headers: {
        "Access-Control-Allow-Origin": "*", // Autorise toutes les origines
        // Vous pouvez ajouter d'autres en-têtes CORS au besoin
      }
    })
  );
};
