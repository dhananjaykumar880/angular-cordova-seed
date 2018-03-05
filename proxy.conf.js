const PROXY_CONFIG = {
    "/api/*": {
        "target": "",
        "cookieDomainRewrite": "",
        "secure": false,
        "pathRewrite": {
            "^/api": ""
        },
        "changeOrigin": true,
        "logLevel": "debug",
        "bypass": function (req, res, proxyOptions) {
            // console.log(req);
        }
    }
};

module.exports = PROXY_CONFIG;