const events = {};

export function on(name, fn) {
  (events[name] ??= []).push(fn);
  return () => off(name, fn);
}

export function once(name, fn) {
  const wrapper = (data) => { off(name, wrapper); fn(data); };
  on(name, wrapper);
}

export function off(name, fn) {
  if (!events[name]) return;
  if (!fn) return delete events[name];       // remove all
  events[name] = events[name].filter(f => f !== fn);
  if (!events[name].length) delete events[name];
}

export function emit(name, data) {
  const listeners = events[name]?.slice();   // snapshot
  if (!listeners) return;
  for (const fn of listeners) {
    try { fn(data); } catch (err) {
      console.error('[bus]', name, err);
    }
  }
}

