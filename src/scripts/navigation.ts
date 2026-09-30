function updateLanguageLink(link: HTMLAnchorElement) {
  link.href = `${link.dataset.languagePath}${location.search}${location.hash}`;
}

function updateLanguageLinks() {
  document.querySelectorAll<HTMLAnchorElement>("a[data-language-path]")
    .forEach(updateLanguageLink);
}

function canPreloadReader() {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  return navigator.onLine && !connection?.saveData && !/2g/.test(connection?.effectiveType ?? "");
}

let readerRequested = false;
function preloadReader() {
  if (readerRequested || !canPreloadReader()) return;
  readerRequested = true;
  void import("@/components/blog-post-page").catch(() => {
    readerRequested = false;
  });
}

const readerObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) {
    preloadReader();
    if (readerRequested) readerObserver.disconnect();
  }
});

function prepareNavigation() {
  updateLanguageLinks();
  readerObserver.disconnect();
  if (!readerRequested && canPreloadReader()) {
    document.querySelectorAll("a[data-reader-link]").forEach((link) => readerObserver.observe(link));
  }
}

function prepareLink(event: Event) {
  const link = event.target instanceof Element ? event.target.closest("a") : null;
  if (!(link instanceof HTMLAnchorElement)) return;
  if (link.hasAttribute("data-language-path")) updateLanguageLink(link);
  if (link.hasAttribute("data-reader-link")) preloadReader();
}

for (const event of ["pointerover", "focusin", "touchstart", "click"]) {
  document.addEventListener(event, prepareLink, { capture: true, passive: true });
}
document.addEventListener("astro:before-swap", () => readerObserver.disconnect());
document.addEventListener("astro:page-load", prepareNavigation);
prepareNavigation();
