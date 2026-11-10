import { initUrlTool } from './modules/urlparser.js';

const tools = document.querySelectorAll('.tool');
const navButtons = document.querySelectorAll('.nav-btn');
const sidebar = document.getElementById('sidebar');

// Show one tool (or the home screen) and hide the others
function showTool(id) {
  tools.forEach(t => t.classList.toggle('active', t.id === id));
  navButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
  sidebar.classList.remove('open');
}

// Sidebar buttons and the cards on the home screen both use data-target
document.querySelectorAll('[data-target]').forEach(el => {
  el.addEventListener('click', () => showTool(el.dataset.target));
});

// Clicking the NetTools title goes back to the home screen
document.getElementById('homeLink').addEventListener('click', () => showTool('home'));

// Hamburger menu (mobile)
document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Theme toggle, saved in localStorage
const themeBtn = document.getElementById('themeBtn');
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

initUrlTool();
