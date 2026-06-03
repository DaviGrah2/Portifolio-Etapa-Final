import { useEffect, useState } from 'react'

export default function useIntersectionObserver(ids = [], options = {}) {
  const [visibleSection, setVisibleSection] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !ids.length) return undefined

    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) {
          setVisibleSection(visibleEntry.target.id)
        }
      },
      { threshold: 0.35, ...options }
    )

    sections.forEach((section) => observer.observe(section))
    return () => sections.forEach((section) => observer.unobserve(section))
  }, [ids.join('|'), JSON.stringify(options)])

  return visibleSection
}
