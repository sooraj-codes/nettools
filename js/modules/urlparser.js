import { validateUrl } from '../utils/validation.js';

const DEFAULT_PORTS = { 'http:': '80', 'https:': '443', 'ftp:': '21' };

// Split a URL object into its parts, each with a color and a plain-English note
export function parseUrl(url) {
  const defaultPort = DEFAULT_PORTS[url.protocol];
  const port = url.port || (defaultPort ? defaultPort + ' (default)' : 'none');
  const params = [...url.searchParams.entries()];

  return [
    { key: 'protocol', label: 'Protocol', value: url.protocol.replace(':', ''), cls: 'p-protocol',
      note: 'The set of rules used to talk to the server. HTTPS means the connection is encrypted.' },
    { key: 'domain', label: 'Domain', value: url.hostname, cls: 'p-domain',
      note: 'The name of the server. DNS turns it into an IP address.' },
    { key: 'port', label: 'Port', value: port, cls: 'p-port',
      note: 'The door on the server. If it is not written, the protocol default is used.' },
    { key: 'path', label: 'Path', value: url.pathname, cls: 'p-path',
      note: 'The exact page or resource requested from the server.' },
    { key: 'query', label: 'Query parameters', value: params.length ? params : 'none', cls: 'p-query',
      note: 'Extra data sent to the server, written as key=value pairs after the ? sign.' },
    { key: 'fragment', label: 'Fragment', value: url.hash || 'none', cls: 'p-fragment',
      note: 'A spot inside the page (after #). It is handled by the browser and not sent to the server.' }
  ];
}

// Build the colored version of the original URL
function coloredUrl(url) {
  const port = url.port ? ':' + url.port : '';
  const part = (cls, text) => `<span class="${cls}">${escapeHtml(text)}</span>`;
  return part('p-protocol', url.protocol + '//') + part('p-domain', url.hostname) +
    part('p-port', port) + part('p-path', url.pathname) +
    part('p-query', url.search) + part('p-fragment', url.hash);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function render(url, resultBox) {
  const parts = parseUrl(url);
  const cards = parts.map(({ label, value, cls, note }) => {
    let shown;
    if (Array.isArray(value)) {
      shown = '<ul>' + value.map(([k, v]) => `<li>${escapeHtml(k)} = ${escapeHtml(v)}</li>`).join('') + '</ul>';
    } else {
      shown = `<p class="part-value">${escapeHtml(value)}</p>`;
    }
    return `<div class="part-card ${cls}">
      <h3>${label}</h3>${shown}<p class="part-note">${note}</p>
    </div>`;
  }).join('');

  resultBox.innerHTML = `<div class="colored-url">${coloredUrl(url)}</div><div class="parts-grid">${cards}</div>`;
}

export function initUrlTool() {
  const form = document.getElementById('urlForm');
  const input = document.getElementById('urlInput');
  const error = document.getElementById('urlError');
  const result = document.getElementById('urlResult');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const check = validateUrl(input.value);
    if (!check.valid) {
      error.textContent = check.message;
      result.innerHTML = '';
      return;
    }
    error.textContent = '';
    render(check.url, result);
  });
}
