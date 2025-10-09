/* main.js — BioGuard Sentinel (v0.5.1) */
/* Zona Verde: theme control, modal login, password toggle, register form hooks */
/* Nota: real login must call Supabase Auth using credentials in assets/js/env.js */

(function () {
  "use strict";

  const htmlEl = document.documentElement;

  // Theme control (persist localStorage)
  function applyTheme(isDark) {
    if (isDark) htmlEl.classList.add("dark"); else htmlEl.classList.remove("dark");
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch(e) {}
  }
  function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? (saved === "dark") : prefersDark;
    applyTheme(useDark);
  }
  initTheme();

  // Theme toggle button
  const themeBtn = document.getElementById("themeToggle");
  const themePath = document.getElementById("themePath");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isNowDark = htmlEl.classList.toggle("dark");
      // change path for visual feedback (simple morph)
      if (themePath) {
        themePath.setAttribute("d", isNowDark ? "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" : "M12 3a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9a9 9 0 0 0-9-9z");
      }
      applyTheme(isNowDark);
    });
  }

  // Modal login open/close
  const openLogin = document.getElementById("openLogin");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");
  if (openLogin && loginModal) {
    openLogin.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const emailInput = loginModal.querySelector("input[type=email]");
      if (emailInput) emailInput.focus();
    });
  }
  if (closeLogin && loginModal) {
    closeLogin.addEventListener("click", () => {
      loginModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  }
  // close on outside click
  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  }

  // Password toggle (delegated)
  document.addEventListener("click", function (ev) {
    const btn = ev.target.closest(".toggle-pass");
    if (!btn) return;
    const parent = btn.closest(".password-field");
    const input = parent ? parent.querySelector("input[type='password'], input[type='text']") : null;
    if (!input) return;
    if (input.type === "password") { input.type = "text"; btn.setAttribute("aria-pressed","true"); } else { input.type = "password"; btn.setAttribute("aria-pressed","false"); }
  });

  // Basic login form (mock behavior for UI)
  const loginForm = document.getElementById("loginForm") || document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = (loginForm.querySelector("input[type='email']") || {}).value || "";
      const password = (loginForm.querySelector("input[type='password']") || {}).value || "";
      if (!email || !password) { alert("Por favor, preencha e-mail e senha."); return; }
      if (password.length < 8) { alert("Senha deve ter pelo menos 8 caracteres."); return; }

      // Zona Amarela -> integrate supabase.auth.signInWithPassword here in next phase
      try {
        if (typeof supabase !== "undefined" && supabase.auth) {
          // Example (deferred real integration): await supabase.auth.signInWithPassword({ email, password })
          console.log("🔐 (mock) tentando login via Supabase:", email);
        }
      } catch (err) { console.warn("Supabase login mock error", err); }

      // Close modal if present
      if (loginModal) { loginModal.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
      alert("Login simulado com sucesso (interface).");
    });
  }

  // Populate specialities in register form (if present)
  const especialidades = {
    "Clínica Médica": ["Infectologia","Endocrinologia","Gastroenterologia","Hematologia"],
    "Cirurgia": ["Geral","Cardíaca","Plástica","Vascular"],
    "Pediatria": ["Neonatologia","Cardiologia Pediátrica"]
  };
  function populateEspecialidades() {
    const sel = document.getElementById("especialidade");
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecione</option>';
    Object.keys(especialidades).forEach(k => {
      const o = document.createElement("option"); o.value = k; o.textContent = k; sel.appendChild(o);
    });
  }
  function bindEspecialidadeLogic() {
    const sel = document.getElementById("especialidade");
    const sub = document.getElementById("subespecialidade");
    if (!sel || !sub) return;
    sel.addEventListener("change", () => {
      const list = especialidades[sel.value] || [];
      sub.innerHTML = '<option value="">Selecione</option>';
      list.forEach(i => { const op = document.createElement("option"); op.value=i; op.textContent=i; sub.appendChild(op); });
    });
  }
  populateEspecialidades();
  bindEspecialidadeLogic();

  // Sou.Gov mock: small UX flow
  const souBtn = document.getElementById("sougov-validate");
  if (souBtn) {
    souBtn.addEventListener("click", () => {
      souBtn.disabled = true; souBtn.textContent = "Validando...";
      setTimeout(()=> { const status = document.getElementById("sougov-status"); if (status) { status.textContent = "Assinatura digital validada"; status.style.color = "var(--accent)"; } souBtn.textContent = "Validado"; }, 1400);
    });
  }

  // Register form basic validation (mock)
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const pw = registerForm.password?.value || "";
      const conf = registerForm.confirm?.value || "";
      const check = document.getElementById("aceite-termos");
      if (!check || !check.checked) { alert("Você deve confirmar os termos."); return; }
      if (pw.length < 8) { alert("Senha deve ter pelo menos 8 caracteres."); return; }
      if (pw !== conf) { alert("As senhas não coincidem."); return; }
      // Zone: integration point to register via Supabase Auth
      alert("Cadastro recebido (simulado). Integração Supabase aplicada na próxima fase.");
      registerForm.reset();
    });
  }

})();

document.addEventListener("DOMContentLoaded", () => {
  const verTermos = document.getElementById("ver-termos");
  if (verTermos) {
    verTermos.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.createElement("div");
      modal.id = "modal-termos";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Termos e Condições de Uso</h2>
          <p>O uso do BioGuard Sentinel implica aceitação integral de suas políticas de privacidade, segurança e ética clínica. Dados são processados apenas conforme finalidades descritas.</p>
          <p>O usuário declara ser profissional da saúde devidamente registrado, comprometendo-se com a veracidade das informações fornecidas.</p>
          <p>© 2025 BioGuard Sentinel — Open Source Clinical Intelligence.</p>
          <button id="fechar-termos">Fechar</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.classList.add("active");

      modal.querySelector("#fechar-termos").addEventListener("click", () => modal.remove());
    });
  }
});
