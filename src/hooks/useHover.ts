import { useRef, useState, useEffect } from 'react'

function useHover(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  function handleMouseOver() {
    setIsHovered(true)
  }

  function handleMouseOut() {
    setIsHovered(false)
  }

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [])

  return [ref, isHovered]
}

export default useHover
