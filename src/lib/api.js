const BASE = '/sp-api'

export function apiFetch(path, options) {
  return fetch(`${BASE}${path}`, options)
}
