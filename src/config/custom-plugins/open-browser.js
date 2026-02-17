import open from "open";

export default function openBrowser(eleventyConfig) {
  eleventyConfig.setServerOptions({
    ready: function (server) {
      open("http://localhost:8080", {
        app: {
          name: "/Applications/Brave Browser.app",
        },
      });
    },
  });
}
