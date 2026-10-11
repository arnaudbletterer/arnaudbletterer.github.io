<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import Icon from './components/Icon.vue'

// A quiet footer (the name, a gradient progress hairline) and the controls: previous, next, full screen and the website's
// round light/dark toggle. They replace Slidev's own toolbar, which is hidden in style.css.
const { currentPage, total, hasPrev, hasNext, prev, next } = useNav()
const pct = computed(() => (total.value > 1 ? ((currentPage.value - 1) / (total.value - 1)) * 100 : 0))
const root = document.documentElement
const dark = ref(root.classList.contains('dark'))
const small = ref(matchMedia('(max-width: 760px)').matches)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

// Switch in place, cross-faded by the browser (View Transitions); a plain swap where they are missing or motion is reduced.
function toggle() {
  const nextDark = !dark.value
  const apply = () => { root.classList.toggle('dark', nextDark); dark.value = nextDark }
  try { localStorage.setItem('theme', nextDark ? 'dark' : 'light') } catch { /* private mode */ }
  const d = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<unknown>; finished: Promise<unknown>; updateCallbackDone: Promise<unknown> } }
  if (d.startViewTransition && !reduce) {
    const t = d.startViewTransition(apply)
    for (const p of [t.ready, t.finished, t.updateCallbackDone]) p.catch(() => {})   // a newer switch aborts this one: expected
  } else apply()
}
function fullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else root.requestFullscreen?.().catch(() => {})
}
</script>

<template>
  <div class="ab-foot" v-show="currentPage > 1">
    <span>Arnaud Bletterer</span><span>{{ currentPage }} / {{ total }}</span>
    <i class="ab-progress" :style="{ width: pct + '%' }" />
  </div>
  <div class="ab-ctl">
    <button class="ab-btn" type="button" aria-label="Previous slide" :disabled="!hasPrev" @click="prev()"><Icon name="left" /></button>
    <button class="ab-btn" type="button" aria-label="Next slide" :disabled="!hasNext" @click="next()"><Icon name="right" /></button>
    <button class="ab-btn" type="button" aria-label="Toggle full screen" @click="fullscreen"><Icon name="expand" /></button>
    <button class="ab-btn" type="button" :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggle"><Icon :name="dark ? 'sun' : 'moon'" /></button>
  </div>
  <a v-if="small" class="ab-notice" href="https://arnaudbletterer.github.io/resume.html">Best on a larger screen. Open the web resume</a>
</template>
