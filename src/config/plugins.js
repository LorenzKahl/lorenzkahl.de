/**
 * Add Eleventy plugins here
 * https://www.11ty.dev/docs/plugins/
 */

import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import shikiPlugin from "./custom-plugins/shiki-plugin.js";
import openBrowser from "./custom-plugins/open-browser.js";
// import reusableComponents from "eleventy-plugin-reusable-components";

export default {
  /**
   * Eleventy Image plugin
   * https://www.11ty.dev/docs/plugins/image/
   */
  async image(eleventyConfig) {
    // Add plugin to eleventyConfig
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      outputDir: "public/assets/images",
      urlPath: "/assets/images/",
      extensions: "html",
      formats: ["auto"],

      // Attributes assigned on <img> override these values.
      defaultAttributes: {
        loading: "lazy",
        decoding: "async",
      },
    });
  },

  /**
   * lorenzkahl.de Reusable Components plugin
   * https://github.com/lorenzkahl/eleventy-plugin-reusable-components
   */
  // async reusableComponents (eleventyConfig) {
  //   // Add plugin to eleventyConfig
  //   eleventyConfig.addPlugin(reusableComponents, {
  //     componentsDir: "src/assets/components/*.njk"
  //   });

  //   // Register CSS and JS component bundles
  //   eleventyConfig.addBundle("componentCss", {
  //     toFileDirectory: "assets/styles/",
  //   });

  //   eleventyConfig.addBundle("componentJs", {
  //     toFileDirectory: "assets/scripts/",
  //   });
  // }

  async shiki(eleventyConfig) {
    eleventyConfig.addPlugin(shikiPlugin);
  },

  async openBrowser(eleventyConfig) {
    eleventyConfig.addPlugin(openBrowser);
  },
};
