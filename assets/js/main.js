// Alternância de tema (🌞/🌙)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Exibir/ocultar senha 👁️
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
});

// Botões informativos com placeholders
document.querySelectorAll('.info-btn').forEach(button => {
  button.addEventListener('click', () => {
    alert(button.dataset.info);
  });
});
