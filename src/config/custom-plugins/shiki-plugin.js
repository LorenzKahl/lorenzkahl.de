import Shiki from "@shikijs/markdown-it";

const shiki = await Shiki({
  themes: { light: "vitesse-light", dark: "github-dark" },
});

export default function shikiPlugin(config) {
  config.amendLibrary("md", (mdLib) => {
    mdLib.use(shiki);
  });
}
