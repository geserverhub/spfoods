export function apiFetch(url, options = {}) {
  const raw = typeof url === 'string' ? url : String(url || '');

  // In Next (port 3005), backend API must goผ่าน rewrite: /sp-api -> localhost:3001/api
  // Keep absolute URLs untouched.
  const isAbsolute = /^https?:\/\//i.test(raw);
  const finalUrl = (!isAbsolute && raw.startsWith('/api/')) ? `/sp-api${raw.slice(4)}` : raw;

  return fetch(finalUrl, options);
}
