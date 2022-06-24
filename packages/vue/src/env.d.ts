/// <reference types="vite/client" />

declare module '*.vue' {
  import { Component } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: Component
  export default component
}
