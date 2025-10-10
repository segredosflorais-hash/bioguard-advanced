/* ============================================================
   BioGuard Sentinel — main.js (v0.5.3.3 consolidated)
   ------------------------------------------------------------
   Inclui:
   - Dark Mode funcional
   - Modal de Termos (.md)
   - Carregamento de Especialidades/Subespecialidades
   - Supabase Auth helpers
   - Estrutura compatível com Protocolo de Confiabilidade
   ============================================================ */

(function() {
  "use strict";

  /* === Tema: Dark / Light === */
  document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const saved = localStorage.getItem("theme") || "dark";
    if (saved === "light") body.classList.remove("dark");
    else body.classList.add("dark");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
      });
    }
  });

  /* === Paths utilitário === */
  function getBasePath() {
    const loc = window.location.pathname;
    if (loc.includes("/BioGuard-Sentinel/")) return "/BioGuard-Sentinel/assets/";
    return "assets/";
  }

  /* === Especialidades e Subespecialidades === */
  async function loadSpecialtiesFromJSON() {
    try {
      const base = getBasePath();
      const res = await fetch(base + "data/specialties.json", {cache: "no-store"});
      if (!res.ok) throw new Error("Falha ao carregar specialties.json (" + res.status + ")");
      const data = await res.json();
      const espSel = document.getElementById("especialidade");
      const subSel = document.getElementById("subespecialidade");
      if (!espSel || !subSel) return;
      espSel.innerHTML = "<option value=''>Selecione</option>";
      Object.keys(data).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        espSel.appendChild(opt);
      });
      espSel.addEventListener("change", () => {
        const list = data[espSel.value] || [];
        subSel.innerHTML = "<option value=''>Selecione</option>";
        list.forEach(s => {
          const op = document.createElement("option");
          op.value = s;
          op.textContent = s;
          subSel.appendChild(op);
        });
      });
      console.log("✅ Especialidades carregadas com sucesso.");
    } catch (err) {
      console.warn("⚠️ Erro ao carregar especialidades:", err.message);
    }
  }

  /* === Modal de Termos === */
  async function loadTermsContent() {
    const modal = document.getElementById("termsModal");
    const content = modal?.querySelector(".terms-content");
    if (!content) return;
    try {
      const base = getBasePath();
      const res = await fetch(base + "terms/termos-uso-bioguard.md", {cache:"no-store"});
      if (!res.ok) throw new Error("Arquivo de Termos não encontrado");
      const text = await res.text();
      if (window.marked) {
        content.innerHTML = marked.parse(text);
      } else {
        content.innerHTML = text.replace(/\n/g, "<br>");
      }
      console.log("✅ Termos carregados corretamente.");
    } catch (err) {
      content.innerHTML = "<p>⚠️ Erro ao carregar Termos: " + err.message + "</p>";
    }
  }

  /* === Modal Termos: abrir/fechar === */
  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("termsModal");
    const btnAccept = document.getElementById("termsAccept");
    const btnClose = document.getElementById("termsClose");

    document.querySelectorAll(".open-terms").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        if (modal) {
          modal.style.display = "flex";
          loadTermsContent();
        }
      });
    });

    if (btnClose) btnClose.addEventListener("click", () => modal.style.display = "none");
    if (btnAccept) {
      btnAccept.addEventListener("click", () => {
        localStorage.setItem("bio_terms_accepted", "1");
        modal.style.display = "none";
        const ch = document.getElementById("aceite-termos");
        if (ch) ch.checked = true;
      });
    }
  });

  /* === Supabase Auth helpers === */
  async function signUpWithSupabase({email, password, metadata}) {
    if (!window.supabase) throw new Error("Supabase SDK não carregado");
    try {
      const res = await supabase.auth.signUp({ email, password }, { data: metadata });
      return res;
    } catch (err) {
      return { error: err };
    }
  }

  async function signInWithSupabase({email, password}) {
    if (!window.supabase) throw new Error("Supabase SDK não carregado");
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      return res;
    } catch (err) {
      return { error: err };
    }
  }

  async function sendPasswordResetEmail(email) {
    if (!window.supabase) throw new Error("Supabase SDK não carregado");
    try {
      const res = await supabase.auth.resetPasswordForEmail(email);
      return res;
    } catch (err) {
      try {
        const res2 = await supabase.auth.api.resetPasswordForEmail(email);
        return res2;
      } catch (err2) {
        return { error: err2 };
      }
    }
  }

  /* === Inicialização global === */
  document.addEventListener("DOMContentLoaded", () => {
    loadSpecialtiesFromJSON();

    // Formulário de Cadastro
    const reg = document.getElementById("registerForm");
    if (reg) {
      reg.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullname = reg.fullname?.value.trim();
        const email = reg.email?.value.trim();
        const pw = reg.password?.value;
        const confirm = reg.confirm?.value;
        const accepted = document.getElementById("aceite-termos")?.checked;
        if (!fullname || !email || !pw || !confirm) {
          alert("Preencha todos os campos obrigatórios.");
          return;
        }
        if (!accepted) {
          alert("Você deve aceitar os Termos antes de continuar.");
          return;
        }
        if (pw !== confirm) {
          alert("As senhas não coincidem.");
          return;
        }
        try {
          const metadata = {
            fullname,
            crm: reg.crm?.value || null,
            uf: reg.uf?.value || null
          };
          const { data, error } = await signUpWithSupabase({ email, password: pw, metadata });
          if (error) {
            alert("Erro ao cadastrar: " + (error.message || JSON.stringify(error)));
            return;
          }
          alert("Cadastro realizado. Verifique seu e-mail para confirmar.");
          reg.reset();
        } catch (err) {
          alert("Erro inesperado: " + err.message);
        }
      });
    }

    // Formulário de Login
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value.trim();
        const password = loginForm.querySelector('input[type="password"]').value;
        if (!email || !password) {
          alert("Informe e-mail e senha.");
          return;
        }
        const { data, error } = await signInWithSupabase({ email, password });
        if (error) {
          alert("Erro no login: " + (error.message || JSON.stringify(error)));
          return;
        }
        alert("Login efetuado com sucesso (simulado).");
      });
    }

    // Formulário de Recuperação
    const recovery = document.querySelector(".recovery-form");
    if (recovery) {
      recovery.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("recovery-email").value.trim();
        if (!email) {
          alert("Informe seu e-mail.");
          return;
        }
        const res = await sendPasswordResetEmail(email);
        if (res?.error) {
          alert("Erro ao enviar e-mail: " + (res.error.message || JSON.stringify(res.error)));
          return;
        }
        alert("Se o e-mail estiver cadastrado, você receberá instruções de redefinição.");
      });
    }
  });

})(); // Fim do módulo principal
