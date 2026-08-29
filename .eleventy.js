import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

const CALLOUT_ICONS = {
  note: "circle-info",
  tip: "lightbulb",
  warning: "triangle-exclamation",
};

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(
      dateObj,
    ),
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date),
  );

  let markdownLibrary;
  let codeBlockCount = 0;
  eleventyConfig.amendLibrary("md", (mdLib) => {
    markdownLibrary = mdLib;

    const defaultFence = mdLib.renderer.rules.fence;
    mdLib.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const rendered = defaultFence(tokens, idx, options, env, self);
      const id = `code-block-${++codeBlockCount}`;
      const withId = rendered.replace("<pre", `<pre id="${id}"`);
      return `<div class="code-block">${withId}<wa-copy-button from="${id}" copy-label="Code kopieren" success-label="Kopiert!" error-label="Fehler beim Kopieren"></wa-copy-button></div>\n`;
    };
  });

  eleventyConfig.addPairedShortcode("callout", (content, variant, title) => {
    const icon = CALLOUT_ICONS[variant];
    if (!icon) {
      throw new Error(
        `Unknown callout variant "${variant}". Expected one of: ${Object.keys(CALLOUT_ICONS).join(", ")}`,
      );
    }

    return `<div class="callout callout--${variant}">
  <wa-icon name="${icon}" aria-hidden="true"></wa-icon>
  <p class="callout__title">${title}</p>
  <div class="callout__body">
    ${markdownLibrary.render(content)}
  </div>
</div>`;
  });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
  };
}
