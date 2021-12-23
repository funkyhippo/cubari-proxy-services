const { proxy } = require("fast-proxy")({
  cacheURLs: 0,
});

module.exports = proxy;
