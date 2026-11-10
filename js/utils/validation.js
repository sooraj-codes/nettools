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
