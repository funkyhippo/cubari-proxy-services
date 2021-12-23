const fastify = require("fastify")({ logger: true, maxParamLength: 2048 });

fastify.register(require("./routes/home"));

// V1 routes
fastify.register(require("./routes/v1/cors"));
fastify.register(require("./routes/v1/image"));

module.exports = fastify;
