import { defineAppSetup } from '@slidev/types'

// Same rule as the website (_layouts/home.html): the saved choice in localStorage 'theme', else the system preference.
// The deck lives on the same origin as the site, so the two share the choice.
export default defineAppSetup(() => {
  let stored: string | null = null
  try { stored = localStorage.getItem('theme') } catch { /* private mode */ }
  const dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', dark)
})
