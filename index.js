const { createSession } = require("./src/flaresolverr");
const server = require("./src/server");
const { sleep } = require("./src/utils");
const PORT = process.env.PORT || 5000;

const start = async (port) => {
  try {
    await createSession();
    console.log(`Listening on port ${port}`);
    await server.listen(port, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(PORT);
