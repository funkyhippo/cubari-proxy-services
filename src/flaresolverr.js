const { default: fetch } = require("node-fetch");
const { sleep } = require("./utils");

const RETRIES = 10;

const createSession = async () => {
  for (let tries = 0; tries < RETRIES; tries++) {
    try {
      const response = await fetch(process.env.FLARESOLVERR_URL, {
        method: "POST",
        body: JSON.stringify({
          cmd: "sessions.create",
          session: process.env.FLARESOLVERR_SESSION,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        // Queue another session creation since it's a no-op
        setTimeout(createSession, 600000);
        return;
      }
    } finally {
      await sleep(5000);
    }
  }

  // Fail fast if the proxy wasn't initialized
  process.exit(1);
};

const flaresolverrRequest = async (type, url) => {
  const response = await fetch(process.env.FLARESOLVERR_URL, {
    method: "POST",
    body: JSON.stringify({
      cmd: `request.${type}`,
      url: url,
      session: process.env.FLARESOLVERR_SESSION,
      // TODO postData isn't supported at the moment
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

module.exports = {
  createSession,
  flaresolverrRequest,
};
