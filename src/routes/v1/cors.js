const {
  getRefererHeader,
  base64UrlDecode,
  normalizeUrl,
  getCacheHeaders,
} = require("../../utils");
const {
  proxy,
  rewriteRequestHeadersHandler,
  rewriteHeadersHandler,
  onResponseHandler,
} = require("../../proxy");

async function routes(fastify, options) {
  fastify.register(require("fastify-cors"), {
    origin: [
      /cubari\.moe/,
      /proxy\.cubari\.moe/,
      /jest\.testing\.local/,
      /localhost/,
    ],
  });

  fastify.get("/:url", (request, reply) => {
    const decodedUrl = normalizeUrl(base64UrlDecode(request.params.url));
    const header = getRefererHeader(request.url, decodedUrl);

    if (
      !("origin" in request.headers) &&
      !("x-requested-with" in request.headers)
    ) {
      return reply
        .code(400)
        .send(new Error("Missing origin or x-requested-with header."));
    }

    return proxy(request.raw, reply.raw, decodedUrl, {
      rewriteRequestHeaders: rewriteRequestHeadersHandler(header),
      rewriteHeaders: rewriteHeadersHandler(
        (headers) => !(headers["content-type"] || "").startsWith("image"),
        ([key, _]) => key.toLowerCase().startsWith("content")
      ),
      onResponse: onResponseHandler(
        "Requested content was an image.",
        reply,
        getCacheHeaders("public", 10, 10)
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
    prefix: "/v1/cors",
  },
};
