/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, MountingOptions } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

/**
 * mountWithDefaults - small wrapper to mount a component with common global stubs
 * and options used across the test-suite. Keeps tests concise and consistent.
 */
export function mountWithDefaults<T extends ComponentPublicInstance>(
  component: any,
  options: MountingOptions<any> = {},
) {
  const defaultOptions: MountingOptions<any> = {
    global: {
      // common stubs for environment features used in examples
      stubs: {
        // SgGrid is heavy; tests can stub it when not under test
        SgGrid: true,
      },
      ...options.global,
    },
    ...options,
  }

  // `mount` has complex generics; cast to any here to keep the helper flexible for tests
  return mount<T>(component as any, defaultOptions as any)
}

/* eslint-enable @typescript-eslint/no-explicit-any */
