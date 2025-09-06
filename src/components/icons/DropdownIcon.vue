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
    <path
      d="M440-440h280v-280H440v280ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
    />
  </svg>
</template>
