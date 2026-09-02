const REQUEST_TIMEOUT_MS = 10_000;
const PAGE_SIZE = 100;

function getAuthHeaders() {
  return {
    accept: "application/json",
    authorization: `Bearer ${process.env.READECK_API_TOKEN}`,
  };
}

async function readeckFetch(path, searchParams = {}) {
  const url = new URL(path, process.env.READECK_HOST);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: getAuthHeaders(),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Readeck API request failed: ${response.status} ${response.statusText} (${url})`);
  }

  return response.json();
}

export async function listBookmarksByLabel(label) {
  const bookmarks = [];
  let offset = 0;

  for (;;) {
    const page = await readeckFetch("/api/bookmarks", {
      labels: label,
      sort: "-created",
      limit: PAGE_SIZE,
      offset,
    });

    if (page.length === 0) break;
    bookmarks.push(...page);
    offset += page.length;
    if (page.length < PAGE_SIZE) break;
  }

  // Defensive re-check: the server-side `labels` match semantics for
  // this API aren't documented, so never trust it exclusively.
  return bookmarks.filter((bookmark) => (bookmark.labels ?? []).includes(label));
}

export async function listAnnotations(bookmarkId) {
  return readeckFetch(`/api/bookmarks/${bookmarkId}/annotations`);
}
