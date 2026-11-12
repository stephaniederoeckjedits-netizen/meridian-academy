export type NavZone = 'sidebar' | 'content'

type ZoneStore = {
  active: NavZone
  listeners: Set<(z: NavZone) => void>
}

function getStore(): ZoneStore {
  if (typeof window === 'undefined') {
    return { active: 'content', listeners: new Set() }
  }
  const w = window as unknown as { __meridianZone?: ZoneStore }
  if (!w.__meridianZone) {
    w.__meridianZone = { active: 'content', listeners: new Set() }
  }
  return w.__meridianZone
}

export function getActiveZone(): NavZone {
  return getStore().active
}

export function setActiveZone(zone: NavZone) {
  const store = getStore()
  if (store.active === zone) return
  store.active = zone
  store.listeners.forEach((l) => l(zone))
}

export function onZoneChange(cb: (z: NavZone) => void) {
  const store = getStore()
  store.listeners.add(cb)
  return () => {
    store.listeners.delete(cb)
  }
}

export function installZoneTracker() {
  if (typeof window === 'undefined') return () => {}
  function onClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    const el = target.closest('[data-nav-zone]') as HTMLElement | null
    if (!el) return
    const zone = el.getAttribute('data-nav-zone')
    if (zone === 'sidebar' || zone === 'content') {
      setActiveZone(zone)
    }
  }
  document.addEventListener('click', onClick, true)
  return () => document.removeEventListener('click', onClick, true)
}