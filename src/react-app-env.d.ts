/// <reference types="vite/client" />

import React from 'react'

declare global {
  namespace JSX {
    // Allow intrinsic elements and their attributes
    type Element = React.ReactElement | null
    type IntrinsicElements = React.JSX.IntrinsicElements
  }
}

export {}
