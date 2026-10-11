<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import bilateral from '../assets/bilateral_teaser.jpg'
import normals from '../assets/normals_teaser.jpg'
import voronoi from '../assets/voronoi_teaser.png'

// A project card like the website's .section-card. The links open the interactive guides on the site.
const props = defineProps<{ id: 'voronoi' | 'bilateral' | 'normals'; title: string; tag: string }>()
const img = computed(() => ({ voronoi, bilateral, normals })[props.id])
const href = computed(() => ({ voronoi: 'partial-voronoi', bilateral: 'bilateral-filter', normals: 'normal-estimation' })[props.id])
</script>

<template>
  <a class="ab-project" :href="`https://arnaudbletterer.github.io/projects/${href}/`" target="_blank" rel="noopener">
    <img :src="img" :alt="title" />
    <div class="ab-project-body">
      <span class="ab-tag">{{ tag }}</span>
      <div class="ab-card-title">{{ title }}</div>
      <div class="ab-card-sub"><slot /></div>
      <span class="ab-open">Explore it live <Icon name="arrow" /></span>
    </div>
  </a>
</template>
