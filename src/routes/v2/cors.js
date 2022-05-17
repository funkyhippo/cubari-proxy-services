const { base64UrlDecode, normalizeUrl } = require("../../utils");
const { flaresolverrRequest } = require("../../flaresolverr");

async function routes(fastify, options) {
  fastify.register(require("fastify-cors"), {
    origin: [
      /cubari\.moe/,
      /proxy\.cubari\.moe/,
      /jest\.testing\.local/,
      /localhost/,
      /hoppscotch\.io/,
      /staging\.guya\.moe/,
      /manga\.guya\.moe/,
      /guya\.moe/,
    ],
  });

  const callback = async (request, reply) => {
    const decodedUrl = normalizeUrl(base64UrlDecode(request.params.url));

    if (
      !("origin" in request.headers) &&
      !("x-requested-with" in request.headers)
    ) {
      return reply
        .code(400)
        .send(new Error("Missing origin or x-requested-with header."));
    }

    const response = await flaresolverrRequest(
      request.method.toLowerCase(),
      decodedUrl,
      request.body
    );

    if (response.status !== 200) {
      return reply.code(400).send(new Error("CF solver failed to solve."));
    }

    // Unfortunately, we'll have to cache the entire response. Not great, but aside
    // from rewriting FlareSolverr, this is the next best thing
    const finalResponse = await response.json();

    if (finalResponse.solution.status !== 200) {
      return reply
        .code(400)
        .send(
          new Error(`Solution returned ${finalResponse.solution.status} code.`)
        );
    }

    if (finalResponse.solution.headers["content-type"] === "application/json") {
      const regex = finalResponse.solution.response.match(/\{([\w\W])+\}/g);
      if (regex[0]) {
        return reply.send(JSON.parse(regex[0]));
      }
    }

    return reply.send(finalResponse.solution.response);
  };

  fastify.get("/:url", callback);
  fastify.post("/:url", callback);
}

module.exports = {
  routes,
  opts: {
    prefix: "/v2/cors",
  },
};
