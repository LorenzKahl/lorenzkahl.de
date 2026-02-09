/**
 * Add Eleventy watch targets here
 * https://www.11ty.dev/docs/watch-serve/
 */

export default {
  /**
   * Watch for changes to files in the assets directory
   */
  assets(eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/assets");
  },
};
