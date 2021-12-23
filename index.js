const server = require("./src/server");
const PORT = process.env.PORT || 5000;

const start = async (port) => {
  try {
    console.log(`Listening on port ${port}`);
    await server.listen(port, "0.0.0.0");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(PORT);
