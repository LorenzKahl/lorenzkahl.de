import { readFile } from "node:fs/promises";
import { listAnnotations, listBookmarksByLabel } from "../lib/readeck.js";
import { buildTextFragmentUrl } from "../lib/text-fragment.js";

const FEATURE_LABEL = "feature-on-website";

function normalizeBookmark(bookmark, annotations) {
  const normalizedAnnotations = annotations.map((annotation) => ({
    id: annotation.id,
    text: annotation.text,
    note: annotation.note && annotation.note.trim() !== "" ? annotation.note.trim() : null,
    textFragmentUrl: buildTextFragmentUrl(bookmark.url, annotation.text),
  }));

  return {
    id: bookmark.id,
    url: bookmark.url,
    title: bookmark.title,
    authors: bookmark.authors ?? [],
    tags: (bookmark.labels ?? []).filter((label) => label !== FEATURE_LABEL),
    created: bookmark.created,
    image: bookmark.resources?.image?.src
      ? {
          src: bookmark.resources.image.src,
          width: bookmark.resources.image.width,
          height: bookmark.resources.image.height,
        }
      : null,
    annotations: normalizedAnnotations,
    highlightsCount: normalizedAnnotations.length,
    annotatedCount: normalizedAnnotations.filter((annotation) => annotation.note !== null).length,
  };
}

function withCreatedDate(item) {
  return { ...item, createdDate: new Date(item.created) };
}

async function loadFromFixture(path) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw).map(withCreatedDate);
}

async function loadFromApi() {
  const bookmarks = await listBookmarksByLabel(FEATURE_LABEL);
  return Promise.all(
    bookmarks.map(async (bookmark) => {
      const annotations = await listAnnotations(bookmark.id);
      return withCreatedDate(normalizeBookmark(bookmark, annotations));
    }),
  );
}

export default async function reads() {
  let items;

  if (process.env.READS_FIXTURE_PATH) {
    items = await loadFromFixture(process.env.READS_FIXTURE_PATH);
  } else if (!process.env.READECK_HOST || !process.env.READECK_API_TOKEN) {
    console.warn("[reads] READECK_HOST/READECK_API_TOKEN not set — /reads will render empty.");
    return [];
  } else {
    items = await loadFromApi();
  }

  return items.sort((a, b) => b.createdDate - a.createdDate);
}
