module.exports = {
  apps: [
    {
      name: "proxy-services",
      script: "index.js",
      cwd: "./",
      instances: 4,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        FLARESOLVERR_SESSION: "sess",
      },
      env_production: {
        NODE_ENV: "production",
        FLARESOLVERR_SESSION: "sess",
      },
    },
  ],
};
