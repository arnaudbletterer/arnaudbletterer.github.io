<script setup lang="ts">
// The home page avatar: a gradient ring with a slowly spinning glow.
import photo from '../assets/profile.jpg'
withDefaults(defineProps<{ size?: number }>(), { size: 148 })
</script>

<template>
  <div class="ab-avatar" :style="{ '--ab-size': size + 'px' }"><img :src="photo" alt="Arnaud Bletterer" /></div>
</template>
