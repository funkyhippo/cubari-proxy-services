module.exports = {
  apps: [
    {
      name: "img-proxy",
      script: "index.js",
      cwd: "./",
      instances: 4,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
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
  ],
};
