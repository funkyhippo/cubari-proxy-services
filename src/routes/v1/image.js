const {
  getRefererHeader,
  base64UrlDecode,
  normalizeUrl,
} = require("../../utils");
const {
  proxy,
  rewriteRequestHeadersHandler,
  rewriteHeadersHandler,
  onResponseHandler,
} = require("../../proxy");

async function routes(fastify, options) {
  fastify.register(require("fastify-caching"), {
    expiresIn: 60 * 60 * 24 * 7,
    privacy: "public",
  });
  fastify.register(require("fastify-cors"), {
    methods: ["GET"],
    origin: "*",
  });

  fastify.get("/:url", (request, reply) => {
    const decodedUrl = normalizeUrl(base64UrlDecode(request.params.url));
    const header = getRefererHeader(request.url, decodedUrl);

    return proxy(request.raw, reply.raw, decodedUrl, {
      rewriteRequestHeaders: rewriteRequestHeadersHandler(header),
      rewriteHeaders: rewriteHeadersHandler(
        (headers) => (headers["content-type"] || "").startsWith("image"),
        ([key, _]) => key.toLowerCase().startsWith("content")
      ),
      onResponse: onResponseHandler(
        "Requested content was not an image.",
        reply
      ),
      request: {
        timeout: fastify.initialConfig.connectionTimeout,
      },
    });
  });
}

module.exports = {
  routes,
  opts: {
    prefix: "/v1/image",
  },
};
