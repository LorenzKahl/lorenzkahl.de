const RANGE_THRESHOLD_WORDS = 20;
const BOUNDARY_WORD_COUNT = 10;

function normalizeQuote(rawText) {
  return rawText.replace(/\s+/g, " ").trim();
}

function encodeFragmentPart(part) {
  // "-" is reserved in the Text Fragment micro-syntax (context prefix/suffix
  // markers), so it must be escaped even though encodeURIComponent leaves it as-is.
  return encodeURIComponent(part).replace(/-/g, "%2D");
}

export function buildTextFragmentUrl(pageUrl, rawText) {
  const normalized = normalizeQuote(rawText);
  const words = normalized.split(" ");

  const value =
    words.length <= RANGE_THRESHOLD_WORDS
      ? encodeFragmentPart(normalized)
      : `${encodeFragmentPart(words.slice(0, BOUNDARY_WORD_COUNT).join(" "))},${encodeFragmentPart(words.slice(-BOUNDARY_WORD_COUNT).join(" "))}`;

  const url = new URL(pageUrl);
  const existingHash = url.hash.replace(/^#/, "");
  url.hash = existingHash ? `${existingHash}:~:text=${value}` : `:~:text=${value}`;
  return url.toString();
}
