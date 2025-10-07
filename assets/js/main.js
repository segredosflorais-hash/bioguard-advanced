/* main.js — BioGuard Sentinel Neon Adaptive */
(function(){
  "use strict";
  const htmlEl = document.documentElement;

  function applyTheme(dark) {
    if (dark) htmlEl.classList.add("dark");
    else htmlEl.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? (saved === "dark") : prefersDark;
    applyTheme(useDark);
  }
  initTheme();

  // Toggle botão SVG
  const themeBtn = document.getElementById("themeToggle");
  const themePath = document.getElementById("themePath");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = htmlEl.classList.toggle("dark");
      themeBtn.classList.add("rotate");
      setTimeout(()=> themeBtn.classList.remove("rotate"), 400);
      if (themePath) {
        themePath.setAttribute("d", isDark
          ? "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          : "M12 3a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9a9 9 0 0 0-9-9z");
      }
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }, { passive: true });
  }

  // Toggle senha
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".toggle-pass, .eye, .toggle-pass-button");
    if (!btn) return;
    const pwdInput = btn.closest(".password-field")?.querySelector('input[type="password"], input[type="text"]')
                     || btn.previousElementSibling || btn.parentElement.querySelector('input[type="password"], input[type="text"]');
    if (!pwdInput) return;
    if (pwdInput.type === "password") {
      pwdInput.type = "text";
      btn.textContent = "🙈";
    } else {
      pwdInput.type = "password";
      btn.textContent = "👁️";
    }
  });

  // Login mock
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;
      if (!email || !password) {
        alert("Por favor, preencha e-mail e senha.");
        return;
      }
      if (password.length < 8) {
        alert("Senha deve ter pelo menos 8 caracteres.");
        return;
      }
      alert("Login simulado com sucesso: " + email);
    });
  }
})();
