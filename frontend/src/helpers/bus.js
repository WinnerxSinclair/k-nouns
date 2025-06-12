// bus.js
const events = {}

export function on  (name, fn) {           // listen
  (events[name] ??= []).push(fn)
  return () => off(name, fn)               // disposer
}
export function off (name, fn) {
  events[name] = (events[name] || []).filter(f => f !== fn)
}
export function emit(name, data) {         // broadcast
  ;(events[name] || []).forEach(f => f(data))
}
