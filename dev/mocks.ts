/*
Dev-only stubs for the LibreTexts host globals. None of this ships in the
production bundle — it exists so the widget can render under the Vite dev server
without a live LibreTexts page. See CLAUDE.md, "Runtime dependencies not in this
repo". Interaction handlers are logged no-ops; render-time calls return just
enough to drive the UI.
*/
function noop(name: string) {
  return (...args: unknown[]): any => console.info(`[mock] ${name}()`, ...args);
}

const mockLibreTexts: typeof window.LibreTexts = {
  active: {},
  current: {},
  libraries: {},
  parseURL: (): [string, ...string[]] => ["chem"], // drives the Resources panel's library branch
  TOC: (coverpageURL: string, selector: string) => {
    const el = document.querySelector(selector);
    if (el)
      el.innerHTML = `<em style="opacity:.6">[mock TOC] ${coverpageURL || "(current page)"}</em>`;
  },
  authenticatedFetch: noop("LibreTexts.authenticatedFetch"),
  getAPI: async () => ({}),
  getCoverpage: async () => "Mock/Coverpage",
  getSubpages: async () => ({}),
  batch: noop("LibreTexts.batch"),
};
window.LibreTexts = mockLibreTexts;

window.buildcite = noop("buildcite");
window.attribution = noop("attribution");
window.saveBookmark = noop("saveBookmark");
window.buildManager = noop("buildManager");
window.libretextGlossary = { makeGlossary: noop("libretextGlossary.makeGlossary") };
window.ga = noop("ga");
window.BeeLineReader = class {
  constructor() {
    console.info("[mock] new BeeLineReader");
  }
  setOptions() {}
  color() {}
  uncolor() {}
};

// Hidden "holder" elements the widget reads for page context.
function holder(id: string, text: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("div");
  el.id = id;
  el.style.display = "none";
  el.innerText = text;
  document.body.appendChild(el);
}
holder("proHolder", "true"); // enables the Developers tab
holder("IDHolder", "12345");
holder("pageTagsHolder", "coverpage:yes");
holder("titleHolder", "Mock Page Title");
