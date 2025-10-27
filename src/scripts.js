import { searchFrom } from "./lib/art.js";
import { el } from "./lib/elements.js";

const artSearcher = document.querySelector(".art-searcher");

const id = new URLSearchParams(window.location.search).get("id");

if (artSearcher instanceof HTMLElement) {
  if (id) {
    const artworkEl = el("p", {}, "Sýna listaverk með id " + id);
    artSearcher?.appendChild(artworkEl);
  } else {
    searchFrom(artSearcher);
  }
}
