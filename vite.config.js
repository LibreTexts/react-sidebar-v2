import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

/*
The widget ships as a single self-mounting IIFE that LibreTexts injects via a
<script> tag: CSS is inlined into the JS (no separate stylesheet) and React is
bundled in (no externals). `npm run build` produces build/sidebar.min.js.
`npm run dev` serves index.html — a standalone harness that stubs the host
globals — with React Fast Refresh.
*/
export default defineConfig(({command}) => ({
    plugins: [
        react(),
        // Tailwind v4 generates the utility CSS (Davis is styled with Tailwind utilities);
        // css-injected-by-js then inlines the single emitted stylesheet into the IIFE.
        // Order matters: Tailwind must run before the inliner.
        tailwindcss(),
        cssInjectedByJsPlugin(),
    ],
    // Lib mode leaves process.env.NODE_ENV untouched (a library shouldn't pin
    // its consumer's env), which ships React/MUI dev branches. This is a
    // self-contained widget, so hardcode production for the build only. Dev
    // must stay "development" for React warnings and Fast Refresh.
    define: command === 'build' ? {'process.env.NODE_ENV': JSON.stringify('production')} : {},
    build: {
        target: 'es2020',
        outDir: 'build',
        emptyOutDir: true,
        // Keep all CSS (Tailwind + Davis + our rules) in one asset so the inliner
        // folds it into the single sidebar.min.js. No stray .css must escape.
        cssCodeSplit: false,
        lib: {
            entry: 'src/pages/index.jsx',
            formats: ['iife'],
            name: 'LibreTextsSidebar',
            fileName: () => 'sidebar.min.js',
        },
    },
}));
