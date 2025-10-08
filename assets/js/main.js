/* main.js — BioGuard Sentinel (v0.4.8) 
   Controls: theme toggle, login modal, login form, eye toggle, recovery redirect
*/

document.addEventListener("DOMContentLoaded", function () {
  // THEME: init/persist
  const htmlEl = document.documentElement;
  function applyTheme(useDark) {
    if (useDark) htmlEl.classList.add("dark"); else htmlEl.classList.remove("dark");
    localStorage.setItem("theme", useDark ? "dark" : "light");
    // update themePath icon (simple swap)
    const themePath = document.getElementById("themePath");
    if (themePath) {
      themePath.setAttribute("d", useDark
        ? "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        : "M12 3a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9a9 9 0 0 0-9-9z");
    }
  }
  (function initTheme(){
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? (saved === "dark") : prefersDark;
    applyTheme(useDark);
  })();

  // theme toggle click
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isDark = !document.documentElement.classList.contains("dark");
      applyTheme(isDark);
      themeBtn.classList.add("bounce");
      setTimeout(()=> themeBtn.classList.remove("bounce"), 300);
    }, { passive: true });
  }

  // LOGIN MODAL logic
  const loginLink = document.getElementById("loginLink");
  const loginModal = document.getElementById("loginModal");
  const modalClose = document.getElementById("modalClose");
  const overlay = loginModal ? loginModal.querySelector(".modal-overlay") : null;

  function openModal(){
    if (!loginModal) return;
    loginModal.classList.add("open");
    loginModal.setAttribute("aria-hidden","false");
  }
  function closeModal(){
    if (!loginModal) return;
    loginModal.classList.remove("open");
    loginModal.setAttribute("aria-hidden","true");
  }

  if (loginLink) {
    loginLink.addEventListener("click", function (ev) {
      ev.preventDefault();
      openModal();
      // Focus email input
      setTimeout(()=> {
        const e = document.getElementById("modal-email");
        if (e) e.focus();
      }, 120);
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  // Eye (SVG) toggle: swaps input type and toggles small graphic (we change aria-pressed)
  const eyeBtn = document.getElementById("eyeToggle");
  if (eyeBtn) {
    eyeBtn.addEventListener("click", function () {
      const pwd = document.getElementById("modal-password");
      if (!pwd) return;
      if (pwd.type === "password") {
        pwd.type = "text";
        eyeBtn.setAttribute("aria-pressed","true");
        // show closed path if present
        const eyeOpen = document.getElementById("eyeOpen");
        if (eyeOpen) eyeOpen.style.display = "none";
        const eyeClosed = document.getElementById("eyeClosed");
        if (eyeClosed) eyeClosed.style.display = "block";
      } else {
        pwd.type = "password";
        eyeBtn.setAttribute("aria-pressed","false");
        const eyeOpen = document.getElementById("eyeOpen");
        if (eyeOpen) eyeOpen.style.display = "block";
        const eyeClosed = document.getElementById("eyeClosed");
        if (eyeClosed) eyeClosed.style.display = "none";
      }
    }, { passive: true });
  }

  // Login submission (mock)
  const modalLoginForm = document.getElementById("modalLoginForm");
  if (modalLoginForm) {
    modalLoginForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const email = (document.getElementById("modal-email")||{}).value || "";
      const password = (document.getElementById("modal-password")||{}).value || "";
      if (!email || !password) { alert("Por favor, preencha e-mail e senha."); return; }
      if (password.length < 8) { alert("Senha deve ter pelo menos 8 caracteres."); return; }
      // Aqui: integrar com Supabase Auth em produção
      alert("Login simulado: " + email);
      closeModal();
    });
  }

  // Accessibility: close modal with ESC
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeModal();
  });
});
