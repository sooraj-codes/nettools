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

// True for private / local IPs (home networks, localhost, etc.). They have no public location.
export function isPrivateIp(ip) {
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 10 ||                          // 10.0.0.0 - 10.255.255.255
    a === 127 ||                         // localhost
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0 - 172.31.255.255
    (a === 192 && b === 168) ||          // 192.168.0.0 - 192.168.255.255
    (a === 169 && b === 254) ||          // link-local
    (a === 100 && b >= 64 && b <= 127)   // carrier-grade NAT (mobile data)
  );
}