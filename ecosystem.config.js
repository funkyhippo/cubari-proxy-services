module.exports = {
  apps: [
    {
      name: "proxy-services",
      script: "index.js",
      cwd: "./",
      instances: 3,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        FLARESOLVERR_URL: "http://localhost:9192/v1",
        FLARESOLVERR_SESSION: "sess",
      },
      env_production: {
        NODE_ENV: "production",
        FLARESOLVERR_URL: "http://localhost:9192/v1",
        FLARESOLVERR_SESSION: "sess",
      },
    },
    {
      name: "keep-alive",
      script: "ping.js",
      cwd: "./",
      instances: 1,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "FlareSolverr",
      script: "dist/server.js",
      cwd: "../flaresolverr",
      instances: 1,
      env: {
        PORT: 9192,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 9192,
        NODE_ENV: "production",
      },
    }
  ],
};
