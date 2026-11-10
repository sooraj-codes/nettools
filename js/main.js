import { initUrlTool } from './modules/urlparser.js';

const navButtons = document.querySelectorAll('.nav-btn');
const tools = document.querySelectorAll('.tool');
const sidebar = document.getElementById('sidebar');

// Switch between tools without reloading the page
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    tools.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
    sidebar.classList.remove('open');
  });
});

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
