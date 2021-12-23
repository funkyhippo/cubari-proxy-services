const {
  getRefererHeader,
  base64UrlDecode,
  normalizeUrl,
} = require("../../utils");
const proxy = require("../../proxy");

async function routes(fastify, options) {
  fastify.register(require("fastify-caching"), {
    expiresIn: 60 * 60 * 24 * 7,
    privacy: "public",
  });

  fastify.get("/v1/image/:url", (request, reply) => {
    const decodedUrl = normalizeUrl(base64UrlDecode(request.params.url));
    const header = getRefererHeader(request.url, decodedUrl);
    proxy(request.raw, reply.raw, decodedUrl, {
      rewriteRequestHeaders(req, headers) {
        return { ...headers, referer: header };
      },
      rewriteHeaders(headers) {
        if (!(headers["content-type"] || "").startsWith("image")) {
          return {};
        } else {
          const returnHeaders = {};
          Object.keys(headers)
            .filter((header) => header.toLowerCase().startsWith("content"))
            .forEach((header) => {
              returnHeaders[header] = headers[header];
            });
          return returnHeaders;
        }
      },
      onResponse(req, res, stream) {
        if (Object.keys(res.getHeaders()).length) {
          reply.send(stream);
        } else {
          reply.send({ error: "Requested content was not an image." });
        }
      },
    });
  });
}

module.exports = routes;