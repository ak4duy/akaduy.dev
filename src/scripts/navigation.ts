function updateLanguageLink(link: HTMLAnchorElement) {
  link.href = `${link.dataset.languagePath}${location.search}${location.hash}`;
}

function updateLanguageLinks() {
  document.querySelectorAll<HTMLAnchorElement>("a[data-language-path]")
    .forEach(updateLanguageLink);
}

function prepareLink(event: Event) {
  const link = event.target instanceof Element ? event.target.closest("a") : null;
  if (!(link instanceof HTMLAnchorElement)) return;
  if (link.hasAttribute("data-language-path")) updateLanguageLink(link);
}

for (const event of ["pointerover", "focusin", "touchstart", "click"]) {
  document.addEventListener(event, prepareLink, { capture: true, passive: true });
}
document.addEventListener("astro:page-load", updateLanguageLinks);
updateLanguageLinks();
