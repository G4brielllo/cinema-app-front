const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  devServer: {

      server: "http",

    allowedHosts: "all",
  },
});
