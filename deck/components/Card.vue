<script setup lang="ts">
import Icon from './Icon.vue'
// A card like the website's .cv-item-card: tag pill, title, subtitle, free content.
defineProps<{ tag?: string; title?: string; sub?: string; icon?: string }>()
</script>

<template>
  <div class="ab-card">
    <div v-if="tag || icon" class="ab-card-top">
      <span v-if="icon" class="ab-card-icon"><Icon :name="icon" /></span>
      <code v-if="tag">{{ tag }}</code>
    </div>
    <div v-if="title" class="ab-card-title">{{ title }}</div>
    <div v-if="sub" class="ab-card-sub">{{ sub }}</div>
    <div class="ab-card-body"><slot /></div>
  </div>
</template>
