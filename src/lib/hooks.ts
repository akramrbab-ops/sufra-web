import { useEffect, useState } from 'react'

const seen = new Set<string>()
/** Fake network latency the first time a list is shown in a session, so skeletons appear. */
export function useFakeLoad(key: string, ms = 300) {
  const [loading, setLoading] = useState(!seen.has(key))
  useEffect(() => {
    if (!loading) return
    const id = setTimeout(() => { seen.add(key); setLoading(false) }, ms)
    return () => clearTimeout(id)
  }, [key, ms, loading])
  return loading
}
