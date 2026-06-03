import { useMemo, useRef } from 'react'

export default function useConversationMemory() {
  const historyRef = useRef([])

  return useMemo(
    () => ({
      push: (message) => {
        historyRef.current = [...historyRef.current.slice(-10), message]
      },
      getHistory: () => historyRef.current,
      clear: () => {
        historyRef.current = []
      },
    }),
    []
  )
}
