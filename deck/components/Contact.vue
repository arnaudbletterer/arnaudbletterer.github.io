<script setup lang="ts">
import Icon from './Icon.vue'
// The hero links of the home page, as pills. `set="nimbledeck"` shows the links of the slide system instead.
const props = withDefaults(defineProps<{ set?: 'me' | 'nimbledeck' }>(), { set: 'me' })
const me = [
  { icon: 'pdf', label: 'Resume (PDF)', href: 'https://arnaudbletterer.github.io/media/arnaud-bletterer-cv.pdf' },
  { icon: 'mail', label: 'Mail', href: 'mailto:arnaud.bletterer@gmail.com' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/arnaud-bletterer-5635b671/' },
  { icon: 'scholar', label: 'Scholar', href: 'https://scholar.google.com/citations?user=fEbApYQAAAAJ' },
  { icon: 'github', label: 'GitHub', href: 'https://github.com/arnaudbletterer' },
  { icon: 'book', label: 'arnaudbletterer.github.io', href: 'https://arnaudbletterer.github.io' },
]
const nimbledeck = [
  { icon: 'book', label: 'Nimbledeck site', href: 'https://arnaudbletterer.github.io/nimbledeck/' },
  { icon: 'github', label: 'Source on GitHub', href: 'https://github.com/arnaudbletterer/nimbledeck' },
]
const links = props.set === 'nimbledeck' ? nimbledeck : me
</script>

<template>
  <div class="ab-links">
    <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener" class="ab-link"><Icon :name="l.icon" />{{ l.label }}</a>
  </div>
</template>
