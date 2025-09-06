<script setup lang="ts">
const props = defineProps<{ size?: number | string; color?: string }>()
const size = props.size ?? 16
const color = props.color ?? 'currentColor'
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :fill="color"
    aria-hidden="true"
    focusable="false"
  >
    <!-- simple circle x (clear) -->
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 13.3-1.4 1.4L12 13.4l-2.9 3.3-1.4-1.4L10.6 12 6.7 8.1l1.4-1.4L12 10.6l2.9-3.9 1.4 1.4L13.4 12l2.9 3.3z"
    />
  </svg>
</template>
