<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
    :fill="color"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ size?: string | number; color?: string }>()
const size = props.size ?? '16'
const color = props.color ?? 'currentColor'
</script>
