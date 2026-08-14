// jshashes ships no types and is CommonJS (main: hashes.js). We only use SHA256().hex.
// Kept in its own script-context file (no top-level import/export) so `declare module`
// is a fresh ambient declaration, not a module augmentation of the untyped package.
declare module "jshashes" {
  class SHA256 {
    hex(input: string): string;
  }
  const Hashes: { SHA256: typeof SHA256 };
  export = Hashes; // CJS default; works with esModuleInterop:true under verbatimModuleSyntax
}
