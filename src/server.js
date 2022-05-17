const fastify = require("fastify")({
  logger: true,
  maxParamLength: 8192,
  connectionTimeout: 15000,
});

// Apply CORS globally since the nested services will require it
fastify.register(require("./routes/home"));

// V1 routes
const { routes: corsRouteV1, opts: corsOptsV1 } = require("./routes/v1/cors");
fastify.register(corsRouteV1, corsOptsV1);

const { routes: imageRouteV1, opts: imageOptsV1 } = require("./routes/v1/image");
fastify.register(imageRouteV1, imageOptsV1);

// V2 routes
const { routes: corsRouteV2, opts: corsOptsV2 } = require("./routes/v2/cors");
fastify.register(corsRouteV2, corsOptsV2);

module.exports = fastify;
