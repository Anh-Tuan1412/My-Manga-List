import { useEffect, useRef } from 'react'

export const useInfiniteObserver = ({ enabled, onIntersect }) => {
  const targetRef = useRef(null)

  useEffect(() => {
    const targetNode = targetRef.current

    if (!enabled || !targetNode) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      {
        rootMargin: '300px',
      }
    )

    observer.observe(targetNode)

    return () => {
      observer.disconnect()
    }
  }, [enabled, onIntersect])

  return targetRef
}
