import { validateIp } from '../utils/validation.js';
import { escapeHtml } from '../utils/format.js';

// Ask the API for IP details. No ip given = look up the user's own IP.
async function fetchIpInfo(ip) {
  const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Network error. Check your internet connection and try again.');
  }

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a minute and try again.');
  }
  if (!response.ok) {
    throw new Error('The lookup service returned an error. Please try again.');
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.reason || 'No information found for this IP.');
  }
  return data;
}

function render(data, resultBox) {
  const fields = [
    ['IP address', data.ip],
    ['Country', data.country_name],
    ['City', data.city],
    ['Region', data.region],
    ['ISP / Organisation', data.org],
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