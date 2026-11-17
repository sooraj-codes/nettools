// Returns { valid: true, url } or { valid: false, message }
export function validateUrl(text) {
  const value = text.trim();
  if (!value) return { valid: false, message: 'Please paste a URL first.' };
  try {
    const url = new URL(value);
    return { valid: true, url };
  } catch {
    return { valid: false, message: 'Invalid URL. Include the protocol, e.g. https://example.com' };
  }
}
// Checks an IPv4 address like 8.8.8.8
export function validateIp(text) {
  const value = text.trim();
  if (!value) return { valid: false, message: 'Please enter an IP address.' };

  const parts = value.split('.');
  const ok = parts.length === 4 && parts.every(p => /^(0|[1-9]\d{0,2})$/.test(p) && Number(p) <= 255);
  if (!ok) return { valid: false, message: 'Invalid IP address. Example: 8.8.8.8' };

  return { valid: true, ip: value };
}
