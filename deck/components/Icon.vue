<script setup lang="ts">
// Font Awesome Free 6 (the set the website uses), inlined so the deck needs no network.
import briefcase from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/briefcase.svg?raw'
import graduation from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/graduation-cap.svg?raw'
import layers from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/layer-group.svg?raw'
import book from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/book-open.svg?raw'
import camera from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/camera.svg?raw'
import laptop from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/laptop-code.svg?raw'
import cube from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/cube.svg?raw'
import guitar from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/guitar.svg?raw'
import people from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/people-group.svg?raw'
import flask from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/flask.svg?raw'
import pen from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/pen-nib.svg?raw'
import diagram from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/diagram-project.svg?raw'
import arrow from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg?raw'
import mail from '../node_modules/@fortawesome/fontawesome-free/svgs/regular/envelope.svg?raw'
import pdf from '../node_modules/@fortawesome/fontawesome-free/svgs/regular/file-pdf.svg?raw'
import linkedin from '../node_modules/@fortawesome/fontawesome-free/svgs/brands/linkedin.svg?raw'
import github from '../node_modules/@fortawesome/fontawesome-free/svgs/brands/github.svg?raw'
import scholar from '../node_modules/@fortawesome/fontawesome-free/svgs/brands/google-scholar.svg?raw'
import x from '../node_modules/@fortawesome/fontawesome-free/svgs/brands/x-twitter.svg?raw'
import moon from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/moon.svg?raw'
import sun from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/sun.svg?raw'
import left from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/angle-left.svg?raw'
import right from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/angle-right.svg?raw'
import expand from '../node_modules/@fortawesome/fontawesome-free/svgs/solid/expand.svg?raw'
import { computed } from 'vue'

const icons: Record<string, string> = { briefcase, graduation, layers, book, camera, laptop, cube, guitar, people, flask, pen, diagram, arrow, mail, pdf, linkedin, github, scholar, x, moon, sun, left, right, expand }
const props = defineProps<{ name: string }>()
const svg = computed(() => icons[props.name] ?? '')
</script>

<template><i class="ab-icon" aria-hidden="true" v-html="svg" /></template>
