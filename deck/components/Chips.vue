<script setup lang="ts">
// Pills in a row for the Marquee bands. Each one opens its article on the website.
const BASE = 'https://arnaudbletterer.github.io/'
const ARTICLES: Record<string, string> = {
  'R&D Principles & Convictions': '2026/07/14/rd-principles-and-convictions.html',
  'On the Shoulders of Giants': '2026/07/19/on-the-shoulders-of-giants.html',
  'The Translation Problem': '2026/07/24/the-translation-problem.html',
  'Leading R&D Teams Without Losing Technical Edge': '2026/08/03/leading-rd-teams-without-losing-technical-edge.html',
  'Leveraging Traction in R&D': '2026/08/06/leveraging-traction-in-rd.html',
  'Managing Exploratory Debt vs. Structural Debt in R&D': '2026/08/15/managing-exploratory-debt-vs-structural-debt.html',
  'AI Agents in Industrial R&D': '2026/08/22/ai-agents-reducing-technical-debt-in-rd.html',
  'Beyond Autocomplete: AI Agents as Forensic Investigators': '2026/08/23/ai-agents-as-forensic-investigators-in-rd.html',
  'The Cadence of Thought': '2026/09/05/the-cadence-of-thought-reclaiming-the-time-to-reflect.html',
  'The Mentorship Paradox': '2026/09/13/the-mentorship-paradox-raising-senior-engineers-in-the-agent-era.html',
  'The Architecture of Calibrated Autonomy': '2026/09/18/the-architecture-of-autonomy-supervisors-workers-and-contracts.html',
  'The Hubris of Expertise': '2026/09/21/the-hubris-of-expertise.html',
  'Failing Fast, Failing Small': '2026/09/26/failing-fast-failing-small.html',
  'Shrink the Loop, Keep the Gate': '2026/09/29/shrink-the-loop-keep-the-gate.html',
}
defineProps<{ items: string[] }>()
</script>

<template>
  <span class="ab-chips">
    <a v-for="i in items" :key="i" class="ab-chip" :href="BASE + ARTICLES[i]" target="_blank" rel="noopener">{{ i }}</a>
  </span>
</template>
