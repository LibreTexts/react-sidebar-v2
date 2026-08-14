// Ambient types for the LibreTexts host globals injected by reuse.js at runtime.
// Types only — nothing here emits. See CLAUDE.md "Runtime dependencies not in this repo".

export {}; // module context so `declare global` augments rather than replaces

/** Node shape returned by getSubpages() children. Loose on purpose — host-defined. */
interface SubpageNode {
  title?: string;
  url?: string;
  children?: SubpageNode[];
  [key: string]: unknown;
}
interface SubpagesResult {
  children?: SubpageNode[];
  [key: string]: unknown;
}

/**
 * Mutable "active page" bag. The widget both reads and writes arbitrary keys
 * (sidebar, sidebarToggleDrawer, libreLens...). Known keys are typed; an index
 * signature keeps host-set / future keys from erroring.
 */
interface LibreTextsActive {
  sidebar?: boolean;
  sidebarToggleDrawer?: (panel?: string | false) => (event?: unknown) => void;
  libreLens?: () => void; // used by Tools AutoAttribution
  [key: string]: unknown;
}

interface LibreTextsAPI {
  active: LibreTextsActive;
  current: Record<string, unknown>;
  libraries: Record<string, unknown>;
  parseURL(url?: string): [subdomain: string, ...rest: string[]];
  TOC(url: string, selector: string): void;
  getAPI(url: string, options?: RequestInit): Promise<unknown>;
  getCoverpage(url?: string): Promise<string | undefined>;
  getSubpages(url?: string): Promise<SubpagesResult>;
  authenticatedFetch(
    path: string | null,
    api: string,
    subdomain?: string | null,
    options?: RequestInit,
  ): Promise<Response>;
  batch(url: string, params: string): unknown;
}

/** BeeLineReader class attached per-element and constructed in Readability. */
interface BeeLineReaderInstance {
  setOptions(options: { theme: string }): void;
  color(): void;
  uncolor(): void;
}
interface BeeLineReaderConstructor {
  new (
    element: Element,
    options: {
      theme: string;
      skipBackgroundColor?: boolean;
      handleResize?: boolean;
      skipTags?: string[];
    },
  ): BeeLineReaderInstance;
}

interface LibretextGlossary {
  makeGlossary(type: string): void;
}

declare global {
  // Bare-global read sites: `LibreTexts.parseURL()`, `new BeeLineReader(...)`, `buildcite()`.
  const LibreTexts: LibreTextsAPI;
  const BeeLineReader: BeeLineReaderConstructor;

  function buildcite(): void;
  function attribution(): void;
  function saveBookmark(): void; // host global (shadowed locally in Tools — both kept)
  function buildManager(): void;
  const libretextGlossary: LibretextGlossary;
  // Google Analytics classic — optional, called via `typeof ga === 'function'`.
  var ga: ((...args: unknown[]) => void) | undefined;

  interface Window {
    Sidebar?: () => void;
    activateBeeLine?: () => void;
    LibreTexts: LibreTextsAPI; // dev/mocks.ts writes this
    BeeLineReader: BeeLineReaderConstructor;
    buildcite: () => void;
    attribution: () => void;
    saveBookmark: () => void;
    buildManager: () => void;
    libretextGlossary: LibretextGlossary;
    ga?: (...args: unknown[]) => void;
  }

  /**
   * Readability attaches a BeeLineReader instance onto DOM elements as `.beeline`.
   * Augment HTMLElement so `el.beeline` typechecks without a cast.
   */
  interface HTMLElement {
    beeline?: BeeLineReaderInstance;
  }
}
