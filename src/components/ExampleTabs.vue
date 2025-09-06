<template>
  <div>
    <div class="tabs" role="tablist" :aria-label="ariaLabel">
      <button
        :class="{ active: view === 'notes' }"
        role="tab"
        :aria-selected="view === 'notes'"
        @click="view = 'notes'"
      >
        Notes
      </button>
      <button
        :class="{ active: view === 'changelog' }"
        role="tab"
        :aria-selected="view === 'changelog'"
        @click="view = 'changelog'"
      >
        Changelog
      </button>
    </div>

    <div
      class="panel"
      style="padding: 12px; border: 1px dashed #e5e7eb; background: #fff; color: #374151"
    >
      <h3 style="margin-top: 0">{{ view === 'notes' ? 'Notes' : title }}</h3>
      <pre style="white-space: pre-wrap; margin: 0">{{ view === 'notes' ? notes : changelog }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps<{
  notes: string
  changelog: string
  title?: string
  ariaLabel?: string
  initial?: 'notes' | 'changelog'
}>()

const view = ref<'notes' | 'changelog'>(props.initial ?? 'notes')
const notes = props.notes || 'No notes available.'
const changelog = props.changelog || 'No changelog available.'
const title = props.title ?? 'Changelog'
const ariaLabel = props.ariaLabel ?? 'Example views'
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.tabs button {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #0f172a;
}
.tabs button.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}
.panel h3 {
  margin: 0 0 8px 0;
}
</style>
