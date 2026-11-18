import { validateIp } from '../utils/validation.js';
import { escapeHtml } from '../utils/format.js';

// Two free APIs. If the first one fails, we try the second one.
const providers = [
  {
    url: (ip) => ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/',
    read: (d) => {
      if (d.error) throw finalError(d.reason || 'No information found for this IP.');
      return { ip: d.ip, country: d.country_name, city: d.city, region: d.region,
               isp: d.org, asn: d.asn, timezone: d.timezone };
    }
  },
  {
    url: (ip) => ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json',
    read: (d) => {
      if (d.bogon) throw finalError('This is a private or reserved IP address.');
      // ipinfo gives org like "AS15169 Google LLC"
      const [asn, ...name] = (d.org || '').split(' ');
      return { ip: d.ip, country: countryName(d.country), city: d.city, region: d.region,
               isp: name.join(' '), asn: asn, timezone: d.timezone };
    }
  }
];
// Turns a country code like "PK" into "Pakistan" (built into the browser)
function countryName(code) {
  if (!code) return '';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
  } catch {
    return code;
  }
}
// An error that means "the API answered, and the answer is no", so no fallback needed
function finalError(message) {
  return Object.assign(new Error(message), { final: true });
}

async function getJson(url) {
  const response = await fetch(url);          // throws if the network fails
  if (!response.ok) throw new Error('Bad response: ' + response.status);
  return response.json();
}

// Ask the APIs for IP details. No ip given = look up the user's own IP.
async function fetchIpInfo(ip) {
  for (const provider of providers) {
    try {
      const data = await getJson(provider.url(ip));
      return provider.read(data);
    } catch (err) {
      if (err.final) throw err;               // real answer (e.g. reserved IP), stop here
      // otherwise try the next provider
    }
  }
  throw new Error('Could not reach the lookup services. Check your internet connection, or wait a minute and try again.');
}

function render(data, resultBox) {
  const fields = [
    ['IP address', data.ip],
    ['Country', data.country],
    ['City', data.city],
    ['Region', data.region],
    ['ISP / Organisation', data.isp],
    ['ASN', data.asn],
    ['Timezone', data.timezone]
  ];

  const cards = fields.map(([label, value]) => `
    <div class="info-card">
      <h3>${label}</h3>
      <p>${escapeHtml(value || 'Not available')}</p>
    </div>`).join('');

  resultBox.innerHTML = `<div class="info-grid">${cards}</div>`;
}

export function initIpTool() {
  const form = document.getElementById('ipForm');
  const input = document.getElementById('ipInput');
  const myIpBtn = document.getElementById('myIpBtn');
  const error = document.getElementById('ipError');
  const result = document.getElementById('ipResult');

  // Shared by both buttons: show loading, call the API, show result or error
  async function lookup(ip) {
    error.textContent = '';
    result.innerHTML = '<p class="loading">Loading...</p>';
    try {
      const data = await fetchIpInfo(ip);
      render(data, result);
    } catch (err) {
      result.innerHTML = '';
      error.textContent = err.message;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const check = validateIp(input.value);
    if (!check.valid) {
      error.textContent = check.message;
      result.innerHTML = '';
      return;
    }
    lookup(check.ip);
  });

  myIpBtn.addEventListener('click', () => {
    input.value = '';
    lookup('');
  });
}
