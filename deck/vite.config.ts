import { defineConfig } from 'vite'

// Vite 8 minifies CSS with lightningcss, which rejects a rule that Slidev's own code.css (the line-number gutter) generates
// and that this deck does not use. The CSS is left unminified instead (a few KB larger); the browser ignores that rule.
export default defineConfig({ build: { cssMinify: false } })
