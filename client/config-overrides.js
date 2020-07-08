const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
// Use newer version of workbox than in CRA
module.exports = function override(config, env) {
  const WBindex = config.plugins.findIndex(
    (plugin) => plugin.constructor.name === "GenerateSW"
  );
  const WBplugin = new WorkboxWebpackPlugin.InjectManifest({
    swSrc: "./src/sw/sw.ts",
    swDest: "service-worker.js",
    compileSrc: true,
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 10, // 10 MB
  });

  if (WBindex > -1) {
    // GenerateSW is found and it means it's production
    config.plugins[WBindex] = WBplugin;
  } else {
    // GenerateSW is not found and it means it's development
    if (process.env.ENABLE_DEV_SERVICE_WORKER === "true") {
      // enable service worker in development mode
      config.plugins.push(WBplugin);
    }
  }
  return config;
};
