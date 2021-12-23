const { ping } = require("./src/utils");

if (process.env.NODE_ENV === "production" && process.env.ACCESS_URL) {
  console.log(`Started with self-ping to ${process.env.ACCESS_URL}`);
  setInterval(() => {
    ping(process.env.ACCESS_URL + `?cache_bust=${Math.random()}`);
  }, 1000 * 30);
}
