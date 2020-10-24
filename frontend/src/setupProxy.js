const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/api", , "/api"], { target: "http://backend:8000" })
  );
};
