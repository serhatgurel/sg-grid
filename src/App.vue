<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import FullDemo from './examples/FullDemo.vue'
import MinimalExample from './examples/MinimalExample.vue'
import FilterSortPlayground from './examples/FilterSortPlayground.vue'

const examples = [
  { id: 'full', label: 'Full Demo', comp: FullDemo },
  { id: 'minimal', label: 'Minimal Example', comp: MinimalExample },
  { id: 'playground', label: 'Filter & Sort Playground', comp: FilterSortPlayground },
]

const selected = ref<string>(examples[0].id)

// Theme: 'light' | 'dark'
const THEME_KEY = 'sg-grid:theme'
const theme = ref<'light' | 'dark'>(
  (localStorage.getItem(THEME_KEY) as 'light' | 'dark') ?? 'light',
)

function applyTheme(t: 'light' | 'dark') {
  const root = document.documentElement
  if (t === 'dark') root.classList.add('theme-dark')
  else root.classList.remove('theme-dark')
}

onMounted(() => {
  applyTheme(theme.value)
})

watch(theme, (val) => {
  localStorage.setItem(THEME_KEY, val)
  applyTheme(val)
})

const currentComponent = computed(() => {
  const found = examples.find((e) => e.id === selected.value)
  return found ? found.comp : examples[0].comp
})
</script>

<template>
  <div>
    <header class="menubar">
      <div class="menubar-left">
        <div class="brand">SG-Grid</div>
        <nav class="nav">
          <a href="#" @click.prevent="selected = 'full'">All Features</a>
          <a href="#" @click.prevent="selected = 'minimal'">Minimal Example</a>
          <a href="#" @click.prevent="selected = 'playground'">Filter & Sort Playground</a>
        </nav>
      </div>
      <div class="menubar-right">
        <fieldset class="theme-toggle" aria-label="Theme">
          <legend class="visually-hidden">Theme</legend>
          <label>
            <input type="radio" name="theme" value="light" v-model="theme" />
            Light
          </label>
          <label>
            <input type="radio" name="theme" value="dark" v-model="theme" />
            Dark
          </label>
        </fieldset>
      </div>
    </header>

    <main class="app-content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<style scoped>
/* page reset for this component */
html,
body,
#app {
  margin: 0;
  padding: 0;
}

.menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #0f172a;
  color: white;
}
.menubar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand {
  font-weight: 700;
  font-size: 1.1rem;
}

.nav a {
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  margin-right: 12px;
  font-size: 0.95rem;
  padding: 8px 12px;
  border-radius: 8px;
  transition:
    background 160ms ease,
    color 120ms ease;
  display: inline-block;
}
.nav a:hover {
  /* block-style highlight with slightly lighter text color */
  /* made 20% lighter per request */
  background: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.98);
  text-decoration: none;
}
.nav a:active {
  background: rgba(255, 255, 255, 0.24);
}

.app-content {
  padding: 12px;
}
</style>
