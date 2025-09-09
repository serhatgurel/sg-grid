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

    <div class="panel">
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
  /* Deselected state uses a softer background that matches the primary color */
  background: var(--sg-button-deselected-bg);
  border: 1px solid var(--sg-button-border);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--sg-button-deselected-color, var(--sg-button-color));
}
.tabs button.active {
  /* Selected state uses the primary menubar/button color */
  background: var(--sg-button-bg);
  color: var(--sg-button-color);
  border-color: var(--sg-button-border);
}
.tabs button:hover {
  /* Hover highlights toward primary */
  background: var(--sg-button-hover-bg);
  color: var(--sg-button-hover-color);
}
.panel h3 {
  margin: 0 0 8px 0;
}
.panel {
  padding: 12px;
  border: 1px dashed var(--sg-panel-border);
  background: var(--sg-panel-bg);
  color: var(--sg-panel-color);
}
</style>
