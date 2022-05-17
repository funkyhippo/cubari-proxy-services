const http = require("http");
const https = require("https");
const urlParser = require("url");
const mapping = require("../mapping.json");

const normalizeUrl = (url) => {
  if (url.startsWith("/")) {
    url = url.slice(1);
  }
  return url.startsWith("http") ? url : `https://${url}`;
};

const extractEncodedUrl = (prefix, path) => {
  return path.replace(prefix, "").split("?")[0];
};

const base64UrlDecode = (string) => {
  const base64String = string.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64String, "base64").toString();
};

const base64UrlEncode = (string) => {
  const base64String = Buffer.from(string).toString("base64");
  return base64String.replace(/\+/g, "-").replace(/\//g, "_");
};

/**
 * The order in which the referer is attained follows this precedence:
 *  1. host query param
 *  2. known mapping
 *  3. target origin
 */
const getRefererHeader = (rawUrlPath, decodedUrl) => {
  const parsedUrl = urlParser.parse(rawUrlPath, true);
  if (parsedUrl.query.host) {
    return parsedUrl.query.host;
  }

  if (!decodedUrl) {
    const encodedUrl = extractEncodedUrl("", rawUrlPath);
    decodedUrl = base64UrlDecode(encodedUrl);
  }

  for (let [target, referer] of Object.entries(mapping)) {
    if (decodedUrl.includes(target)) {
      return referer;
    }
  }
  return normalizeUrl(decodedUrl);
};

const getCacheHeaders = (privacy, maxAge, sMaxAge) => {
  return `${privacy}, max-age=${maxAge}, s-maxage=${sMaxAge}`;
};

const ping = (url) => {
  if (url.startsWith("https:")) {
    https.get(url);
  } else if (url.startsWith("http:")) {
    http.get(url);
  }
};

const sleep = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

module.exports = {
  normalizeUrl,
  extractEncodedUrl,
  getRefererHeader,
  base64UrlDecode,
  base64UrlEncode,
  getCacheHeaders,
  ping,
  sleep,
};
