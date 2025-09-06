<script setup lang="ts">
const props = defineProps<{ size?: number | string; color?: string }>()
const size = props.size ?? 16
const color = props.color ?? 'currentColor'
</script>

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
    <path d="M160-360v-80h640v80H160Zm0-160v-80h640v80H160Z" />
  </svg>
</template>
