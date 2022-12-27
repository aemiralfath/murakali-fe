import { useRef, useState, useEffect } from 'react'
import useSsr from './useSSR'

function useHover(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { isBrowser } = useSsr()

  function handleMouseOver() {
    setIsHovered(true)
  }
  function handleMouseOut() {
    setIsHovered(false)
  }

  useEffect(() => {
    if (isBrowser) {
      const node = ref.current
      if (document.readyState === 'complete') {
        if (node) {
          node.addEventListener('mouseover', handleMouseOver)
          node.addEventListener('mouseout', handleMouseOut)
          return () => {
            node.removeEventListener('mouseover', handleMouseOver)
            node.removeEventListener('mouseout', handleMouseOut)
          }
        }
      }
    }
  }, [isBrowser])

  return [ref, isHovered]
}

export default useHover
