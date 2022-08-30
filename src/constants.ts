export const HYDRATION_MARKER = 'data-ink-mde-ssr-hydration-marker'
export const HYDRATION_MARKER_SELECTOR = `[${HYDRATION_MARKER}]`

export const getHydrationMarkerProps = () => {
  if (import.meta.env.VITE_SSR) {
    return {
      [HYDRATION_MARKER]: true,
    }
  }

  return {}
}
