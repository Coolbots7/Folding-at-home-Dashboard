const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy(
            "/fah/**", {
            target: "https://api.foldingathome.org",
            changeOrigin: true,
            pathRewrite: {
                "^/fah": ""
            }
        })
    );

    app.use(
        proxy(
            "/api/**", {
            target: "http://192.168.2.155:3001",
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
            }
        })
    );
};