import { useEffect } from 'react'
export function useChatScroll(dep: any, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [dep, ref])
}
