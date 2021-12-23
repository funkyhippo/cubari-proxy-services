const fastify = require("fastify")({ logger: true, maxParamLength: 2048 });

// Apply CORS globally since the nested services will require it
fastify.register(require("./routes/home"));

// V1 routes
const { routes: corsRoute, opts: corsOpts } = require("./routes/v1/cors");
fastify.register(corsRoute, corsOpts);

const { routes: imageRoute, opts: imageOpts } = require("./routes/v1/image");
fastify.register(imageRoute, imageOpts);

module.exports = fastify;
