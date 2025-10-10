/* =========================
   BioGuard Sentinel — main.js
   v0.5.3.3-fixmodal (correções)
   - restaura dark mode (html.dark)
   - modal Termos: abrir/fechar (botão, overlay e ESC)
   - carregamento .md (terms) com fallback
   - carregamento specialties.json
   - toggle senha com ícone SVG vetorizado (sem emoji)
   - helpers Supabase (mantidos)
   ========================= */

(function () {
  "use strict";

  const HTML = document.documentElement;
  const THEME_KEY = "bioguard_theme";

  /* -------------------------
     Theme (html.dark) helpers
     ------------------------- */
  function applyTheme(mode) {
    if (mode === "dark") HTML.classList.add("dark");
    else HTML.classList.remove("dark");
    try { localStorage.setItem(THEME_KEY, mode); } catch (_) {}
    updateThemeIcon(mode);
  }
  function updateThemeIcon(mode) {
    const path = document.getElementById("themePath") || document.querySelector("#themePath");
    if (!path) return;
    const dDark = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
    const dLight = "M12 3a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9a9 9 0 0 0-9-9z";
    path.setAttribute("d", mode === "dark" ? dDark : dLight);
  }
  function initTheme() {
    const saved = (() => {
      try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
    })();
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const mode = saved || (prefersDark ? "dark" : "light");
    applyTheme(mode);
  }

  /* -------------------------
     Utility: base assets path
     ------------------------- */
  function getBasePath() {
    const loc = window.location.pathname || "";
    // fallback para casos em que o site está servindo de subpasta
    if (loc.includes("/BioGuard-Sentinel/")) return "/BioGuard-Sentinel/assets/";
    return "assets/";
  }

  /* -------------------------
     Specialties loader (JSON)
     ------------------------- */
  async function loadSpecialtiesFromJSON() {
    try {
      const base = getBasePath();
      const res = await fetch(base + "data/specialties.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const espSel = document.getElementById("especialidade");
      const subSel = document.getElementById("subespecialidade");
      if (!espSel) { console.warn("⚠️ select#especialidade não encontrado"); return; }
      if (!subSel) { console.warn("⚠️ select#subespecialidade não encontrado"); return; }
      // popular
      espSel.innerHTML = "<option value=''>Selecione</option>";
      Object.keys(data).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key; opt.textContent = key;
        espSel.appendChild(opt);
      });
      espSel.addEventListener("change", () => {
        const list = data[espSel.value] || [];
        subSel.innerHTML = "<option value=''>Selecione</option>";
        list.forEach(s => {
          const op = document.createElement("option");
          op.value = s; op.textContent = s;
          subSel.appendChild(op);
        });
      });
      console.log("✅ Especialidades carregadas com sucesso.");
    } catch (err) {
      console.warn("⚠️ Erro ao carregar specialties.json:", err && err.message ? err.message : err);
    }
  }

  /* -------------------------
     Terms modal: load .md -> HTML (fallback)
     ------------------------- */
  async function loadTermsContent() {
    try {
      const modal = document.getElementById("termsModal");
      const content = modal?.querySelector(".terms-content");
      if (!content) { console.warn("⚠️ Modal ou .terms-content não encontrado"); return; }

      const base = getBasePath();
      const url = base + "terms/termos-uso-bioguard.md";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Arquivo de Termos não encontrado (" + res.status + ")");
      const text = await res.text();

      // se a lib "marked" estiver disponível (inserida via CDN), usa ela
      if (window.marked && typeof window.marked === "function") {
        content.innerHTML = marked.parse(text);
      } else {
        // fallback simples: transformar títulos (#) e quebras de linha
        let html = text
          .replace(/^### (.*$)/gim, "<h3>$1</h3>")
          .replace(/^## (.*$)/gim, "<h2>$1</h2>")
          .replace(/^# (.*$)/gim, "<h1>$1</h1>")
          .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/gim, "<em>$1</em>")
          .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
          .replace(/\n/g, "<br>");
        content.innerHTML = html;
      }
      console.log("✅ Termos carregados corretamente.");
    } catch (err) {
      const modal = document.getElementById("termsModal");
      const content = modal?.querySelector(".terms-content");
      if (content) content.innerHTML = "<p>⚠️ Erro ao carregar Termos: " + (err.message || err) + "</p>";
      console.warn("⚠️ loadTermsContent:", err);
    }
  }

  /* -------------------------
     Modal: abrir / fechar (overlay, botão e ESC)
     ------------------------- */
  function openTermsModal() {
    const modal = document.getElementById("termsModal");
    if (!modal) return;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    loadTermsContent();
  }
  function closeTermsModal() {
    const modal = document.getElementById("termsModal");
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  /* -------------------------
     Eye SVGs (vetorial)
     ------------------------- */
  function eyeOpenSVG() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 5c-7 0-11 6-11 7s4 7 11 7 11-6 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>';
  }
  function eyeClosedSVG() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 5c-7 0-11 6-11 7 1 1 5 7 11 7 2 0 4-.5 5.5-1.4l2.1 2.1 1.4-1.4L4.2 3.6 2.8 5l2.1 2.1C4.5 8.4 3 9.4 2 11c1 1.6 5 7 10 7 7 0 11-6 11-7 0-.6-.7-2.3-2.1-3.8L20 6.5 18.6 5 16 7.6C14.6 6.8 13.3 6 12 6z"/></svg>';
  }

  /* -------------------------
     Toggle password (delegation)
     - buttons should have class .toggle-pass and be inside .password-field
     ------------------------- */
  function togglePasswordField(btn) {
    if (!btn) return;
    const pwdWrapper = btn.closest(".password-field");
    const input = pwdWrapper?.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;
    const isPwd = input.type === "password";
    input.type = isPwd ? "text" : "password";
    // atualiza ícone vetorial
    btn.innerHTML = isPwd ? eyeClosedSVG() : eyeOpenSVG();
    btn.setAttribute("aria-pressed", isPwd ? "true" : "false");
  }

  /* -------------------------
     Supabase helpers (mantidos)
     ------------------------- */
  async function signUpWithSupabase({ email, password, metadata }) {
    if (!window.supabase) throw new Error("Supabase SDK não carregado");
    try {
      return await supabase.auth.signUp({ email, password }, { data: metadata });
    } catch (err) { return { error: err }; }
  }
  async function signInWithSupabase({ email, password }) {
    if (!window.supabase) throw new Error("Supabase SDK não carregado");
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (err) { return { error: err }; }
  }
  async function sendPasswordResetEmail(email) {
    if (!window.supabase) throw new Error("Supabase SDK não carregado");
    try { return await supabase.auth.resetPasswordForEmail(email); }
    catch (err) {
      try { return await supabase.auth.api.resetPasswordForEmail(email); }
      catch (err2) { return { error: err2 }; }
    }
  }

  /* -------------------------
     DOMContentLoaded: bind tudo
     ------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    // Theme init
    initTheme();

    // Theme toggle: aceita múltiplos identificadores
    const themeBtn = document.querySelector(".theme-toggle") || document.getElementById("themeToggle") || document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const isDark = HTML.classList.toggle("dark");
        const mode = isDark ? "dark" : "light";
        try { localStorage.setItem(THEME_KEY, mode); } catch (_) {}
        updateThemeIcon(mode);
        // animation cue
        themeBtn.classList.add("rotate");
        setTimeout(() => themeBtn.classList.remove("rotate"), 350);
      });
    }

    // Toggle password: delegação (captura qualquer botão .toggle-pass)
    document.body.addEventListener("click", function (ev) {
      const t = ev.target;
      const toggleBtn = t.closest && t.closest(".toggle-pass");
      if (toggleBtn) {
        ev.preventDefault();
        // inicializa com SVG se estiver vazio
        if (toggleBtn.innerHTML.trim() === "") toggleBtn.innerHTML = eyeOpenSVG();
        togglePasswordField(toggleBtn);
      }
    }, { passive: true });

    // Termos modal openers
    document.querySelectorAll(".open-terms").forEach(el => {
      el.addEventListener("click", function (e) {
        e.preventDefault(); openTermsModal();
      });
    });

    // Bind close/accept buttons (se existirem)
    document.addEventListener("click", function (ev) {
      const target = ev.target;
      if (target && (target.id === "termsClose" || target.classList.contains("terms-close"))) {
        closeTermsModal();
      }
      if (target && target.id === "termsAccept") {
        try { localStorage.setItem("bio_terms_accepted", "1"); } catch (_) {}
        const ch = document.getElementById("aceite-termos"); if (ch) ch.checked = true;
        closeTermsModal();
      }
    }, { passive: true });

    // overlay click (fecha se clicar fora do inner)
    const modal = document.getElementById("termsModal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeTermsModal();
      });
    }

    // ESC fecha modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        const modal = document.getElementById("termsModal");
        if (modal && modal.style.display === "flex") closeTermsModal();
      }
    });

    // Carregar specialties
    loadSpecialtiesFromJSON();

    // Hook forms: cadastro
    const reg = document.getElementById("registerForm");
    if (reg) {
      reg.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        const fullname = reg.fullname?.value?.trim();
        const email = reg.email?.value?.trim();
        const pw = reg.password?.value;
        const confirm = reg.confirm?.value;
        const accepted = document.getElementById("aceite-termos")?.checked;
        if (!fullname || !email || !pw || !confirm) { alert("Preencha todos os campos obrigatórios."); return; }
        if (!accepted) { alert("Você deve aceitar os Termos antes de continuar."); return; }
        if (pw !== confirm) { alert("As senhas não coincidem."); return; }
        try {
          const metadata = { fullname, crm: reg.crm?.value || null, uf: reg.uf?.value || null };
          const { data, error } = await signUpWithSupabase({ email, password: pw, metadata });
          if (error) { alert("Erro ao cadastrar: " + (error.message || JSON.stringify(error))); return; }
          alert("Cadastro registrado. Verifique seu e-mail para confirmação (se habilitado).");
          reg.reset();
        } catch (err) { alert("Erro inesperado: " + (err.message || err)); }
      });
    }

    // Hook forms: login
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        const email = loginForm.querySelector('input[type="email"]')?.value?.trim();
        const password = loginForm.querySelector('input[type="password"]')?.value;
        if (!email || !password) { alert("Informe e-mail e senha."); return; }
        const { data, error } = await signInWithSupabase({ email, password });
        if (error) { alert("Erro no login: " + (error.message || JSON.stringify(error))); return; }
        alert("Login efetuado com sucesso (simulado).");
      });
    }

    // recovery form
    const recovery = document.querySelector(".recovery-form");
    if (recovery) {
      recovery.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        const email = document.getElementById("recovery-email")?.value?.trim();
        if (!email) { alert("Informe seu e-mail."); return; }
        try {
          const res = await sendPasswordResetEmail(email);
          if (res?.error) { alert("Erro ao enviar e-mail: " + (res.error.message || JSON.stringify(res.error))); return; }
          alert("Se o e-mail estiver cadastrado, você receberá instruções de redefinição.");
        } catch (err) { alert("Erro: " + (err.message || err)); }
      });
    }

  }); // DOMContentLoaded

})(); // IIFE
