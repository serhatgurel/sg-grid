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
    <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ size?: string | number; color?: string }>()
const size = props.size ?? '16'
const color = props.color ?? 'currentColor'
</script>
