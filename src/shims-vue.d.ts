/* Vue single-file component module declarations */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Generic component type fallback (props, emits, slots not inferred here)
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
