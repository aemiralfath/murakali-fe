function useSsr() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return {
    isBrowser: Boolean(isDOM),
    isServer: !isDOM,
  }
}

export default useSsr
