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
    <!-- classic close (x) icon -->
    <path
      d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.3 9.18 12 2.88 5.71 4.29 4.29 10.59 10.59 16.88 4.29z"
    />
  </svg>
</template>
