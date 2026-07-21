/*
Dev-only stubs for the LibreTexts host globals. None of this ships in the
production bundle — it exists so the widget can render under the Vite dev server
without a live LibreTexts page. See CLAUDE.md, "Runtime dependencies not in this
repo". Interaction handlers are logged no-ops; render-time calls return just
enough to drive the UI.
*/
function noop(name) {
    return (...args) => console.info(`[mock] ${name}()`, ...args);
}

window.LibreTexts = {
    active: {},
    libraries: {},
    parseURL: () => ['chem'], // drives the Resources panel's library branch
    TOC: (coverpageURL, selector) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = `<em style="opacity:.6">[mock TOC] ${coverpageURL || '(current page)'}</em>`;
    },
    authenticatedFetch: noop('LibreTexts.authenticatedFetch'),
    getCoverpage: async () => 'Mock/Coverpage',
};

window.buildcite = noop('buildcite');
window.attribution = noop('attribution');
window.saveBookmark = noop('saveBookmark');
window.buildManager = noop('buildManager');
window.libretextGlossary = { makeGlossary: noop('libretextGlossary.makeGlossary') };
window.ga = noop('ga');
window.BeeLineReader = class {
    constructor() { console.info('[mock] new BeeLineReader'); }
    setOptions() {}
    color() {}
    uncolor() {}
};

// Hidden "holder" elements the widget reads for page context.
function holder(id, text) {
    if (document.getElementById(id)) return;
    const el = document.createElement('div');
    el.id = id;
    el.style.display = 'none';
    el.innerText = text;
    document.body.appendChild(el);
}
holder('proHolder', 'true');            // enables the Developers tab
holder('IDHolder', '12345');
holder('pageTagsHolder', 'coverpage:yes');
holder('titleHolder', 'Mock Page Title');
