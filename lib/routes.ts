import type { Language } from "@/lib/i18n";

// GitHub Pages serves directory indexes. Missing trailing slashes cost a redirect.
export function localizedPath(language: Language, path = "") {
  const route = path.replace(/^\/+|\/+$/g, "");
  return `/${language.toLowerCase()}/${route ? `${route}/` : ""}`;
}
