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
    config.plugins[WBindex] = WBplugin;
  } else {
    config.plugins.push(WBplugin);
  }
  return config;
};
