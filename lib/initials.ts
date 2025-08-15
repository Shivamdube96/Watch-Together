export function initials(name: string) {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
