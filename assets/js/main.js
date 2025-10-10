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

/* === Etapa 2 additions: specialties loader, terms modal, and Supabase auth helpers === */

async function loadSpecialtiesFromJSON() {
  try {
    const res = await fetch("assets/data/specialties.json", {cache: "no-store"});
    if (!res.ok) throw new Error("Falha ao carregar specialties.json");
    const data = await res.json();
    const espSel = document.getElementById("especialidade");
    const subSel = document.getElementById("subespecialidade");
    if (!espSel) return;
    // limpa
    espSel.innerHTML = "<option value=\"\">Selecione</option>";
    Object.keys(data).forEach(key => {
      const opt = document.createElement("option");
      opt.value = key; opt.textContent = key;
      espSel.appendChild(opt);
    });
    espSel.addEventListener("change", () => {
      const list = data[espSel.value] || [];
      subSel.innerHTML = "<option value=\"\">Selecione</option>";
      list.forEach(s => {
        const op = document.createElement("option"); op.value = s; op.textContent = s;
        subSel.appendChild(op);
      });
    });
  } catch (err) {
    console.warn("loadSpecialtiesFromJSON:", err.message);
  }
}

/* Terms modal logic */
(function() {
  const modal = document.getElementById("termsModal");
  const btnAccept = document.getElementById("termsAccept");
  const btnClose = document.getElementById("termsClose");
  // open link(s)
  document.querySelectorAll(".open-terms").forEach(el=>{
    el.addEventListener("click", (e)=>{
      e.preventDefault();
      if (modal) modal.style.display = "flex";
    });
  });
  if (btnClose) btnClose.addEventListener("click", ()=> modal.style.display = "none");
  if (btnAccept) {
    btnAccept.addEventListener("click", ()=>{
      localStorage.setItem("bio_terms_accepted", "1");
      modal.style.display = "none";
      // if there's a checkbox for acceptance, check it
      const ch = document.getElementById("aceite-termos");
      if (ch) { ch.checked = true; }
    });
  }
})();

/* Supabase auth helpers (Zone: Amarela — ajuste se SDK mudar) */
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
    // signInWithPassword é a forma v2; se sua SDK for v1 adapte para signIn
    const res = await supabase.auth.signInWithPassword({ email, password });
    return res;
  } catch (err) {
    return { error: err };
  }
}

async function sendPasswordResetEmail(email) {
  if (!window.supabase) throw new Error("Supabase SDK não carregado");
  try {
    // Tentativa com API v2:
    const res = await supabase.auth.resetPasswordForEmail(email);
    return res;
  } catch (err) {
    // fallback (versões antigas)
    try {
      const res2 = await supabase.auth.api.resetPasswordForEmail(email);
      return res2;
    } catch (err2) {
      return { error: err2 };
    }
  }
}

/* Hook forms if present */
document.addEventListener("DOMContentLoaded", () => {
  loadSpecialtiesFromJSON();

  // cadastro form (if exists)
  const reg = document.getElementById("registerForm");
  if (reg) {
    reg.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullname = reg.fullname.value.trim();
      const email = reg.email.value.trim();
      const pw = reg.password.value;
      const confirm = reg.confirm.value;
      const accepted = document.getElementById("aceite-termos")?.checked;
      if (!fullname || !email || !pw || !confirm) { alert("Preencha os campos obrigatórios."); return; }
      if (!accepted) { alert("Você deve aceitar os Termos."); return; }
      if (pw !== confirm) { alert("Senhas não coincidem."); return; }
      // call supabase signUp
      try {
        const metadata = { fullname, crm: reg.crm?.value || null, uf: reg.uf?.value || null };
        const { data, error } = await signUpWithSupabase({ email, password: pw, metadata });
        if (error) { alert("Erro ao cadastrar: " + (error.message || JSON.stringify(error))); return; }
        alert("Cadastro realizado. Verifique seu e-mail para confirmação (se habilitado).");
        reg.reset();
      } catch (err) {
        alert("Erro inesperado: " + err.message);
      }
    });
  }

  // login form (if exists)
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;
      if (!email || !password) { alert("Preencha e-mail e senha."); return; }
      const { data, error } = await signInWithSupabase({ email, password });
      if (error) { alert("Erro login: " + (error.message||JSON.stringify(error))); return; }
      alert("Login efetuado (simulado). Redirecionar conforme fluxo (implemente dashboard).");
    });
  }

  // recovery form
  const recovery = document.querySelector(".recovery-form");
  if (recovery) {
    recovery.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("recovery-email").value.trim();
      if (!email) { alert("Informe seu e-mail."); return; }
      const res = await sendPasswordResetEmail(email);
      if (res?.error) { alert("Erro ao enviar e-mail de recuperação: " + (res.error.message || JSON.stringify(res.error))); return; }
      alert("Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.");
    });
  }
});

/* === Correções v0.5.3.1 === */
async function loadTermsContent(){
  const modal=document.getElementById("termsModal");
  const content=modal?.querySelector(".terms-content");
  if(!content) return;
  try{
    const res=await fetch("assets/terms/termos-uso-bioguard.md");
    if(!res.ok) throw new Error("Arquivo não encontrado");
    const text=await res.text();
    if(window.marked){ content.innerHTML=marked.parse(text); }
    else{ content.innerHTML=text.replace(/\n/g,"<br>"); }
  }catch(err){ content.innerHTML="<p>Erro: "+err.message+"</p>"; }
}
document.querySelectorAll(".open-terms").forEach(el=>{
  el.addEventListener("click",(e)=>{
    e.preventDefault();loadTermsContent();
    document.getElementById("termsModal").style.display="flex";
  });
});

/* === Patch v0.5.3.2 — Correção de caminhos e carregamento === */

// Forçar basepath relativo correto
function getBasePath() {
  const loc = window.location.pathname;
  if (loc.includes("/BioGuard-Sentinel/")) return "/BioGuard-Sentinel/assets/";
  return "assets/";
}

// Corrigir carregamento de especialidades/subespecialidades
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
    console.warn("⚠️ Erro ao carregar especialidades:", err.message);
  }
}

// Corrigir carregamento dos Termos
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

/* === UF loader v0.5.3.4 (popula select#uf) === */
function populateUFs() {
  const ufs = [
    {code:'AC', name:'Acre'},
    {code:'AL', name:'Alagoas'},
    {code:'AP', name:'Amapá'},
    {code:'AM', name:'Amazonas'},
    {code:'BA', name:'Bahia'},
    {code:'CE', name:'Ceará'},
    {code:'DF', name:'Distrito Federal'},
    {code:'ES', name:'Espírito Santo'},
    {code:'GO', name:'Goiás'},
    {code:'MA', name:'Maranhão'},
    {code:'MT', name:'Mato Grosso'},
    {code:'MS', name:'Mato Grosso do Sul'},
    {code:'MG', name:'Minas Gerais'},
    {code:'PA', name:'Pará'},
    {code:'PB', name:'Paraíba'},
    {code:'PR', name:'Paraná'},
    {code:'PE', name:'Pernambuco'},
    {code:'PI', name:'Piauí'},
    {code:'RJ', name:'Rio de Janeiro'},
    {code:'RN', name:'Rio Grande do Norte'},
    {code:'RS', name:'Rio Grande do Sul'},
    {code:'RO', name:'Rondônia'},
    {code:'RR', name:'Roraima'},
    {code:'SC', name:'Santa Catarina'},
    {code:'SP', name:'São Paulo'},
    {code:'SE', name:'Sergipe'},
    {code:'TO', name:'Tocantins'}
  ];

  const sel = document.getElementById('uf');
  if (!sel) {
    console.warn("⚠️ select#uf não encontrado em cadastro.html — verifique o HTML.");
    return;
  }

  sel.innerHTML = '<option value=\"\">Selecione</option>';
  ufs.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.code;
    opt.textContent = `${u.code} — ${u.name}`;
    sel.appendChild(opt);
  });

  console.log("✅ UFs do CRM carregadas:", ufs.length);
}

// Autoexec sem interferir em listeners existentes
(function(){
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateUFs);
  } else {
    populateUFs();
  }
})();

/* --- Diagnostics logger (v0.5.3.5) - logs presence of selects on DOMContentLoaded --- */
(function(){
  function diag() {
    console.log("⚙️ Diagnostics: #especialidade =", !!document.getElementById("especialidade"));
    console.log("⚙️ Diagnostics: #subespecialidade =", !!document.getElementById("subespecialidade"));
    console.log("⚙️ Diagnostics: #uf =", !!document.getElementById("uf"));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", diag);
  } else { diag(); }
})();

/* === Patch v0.5.3.6 — UF loader reliability fix === */
function populateUFsSafe() {
  const ufs = [
    {code:'AC',name:'Acre'},{code:'AL',name:'Alagoas'},{code:'AP',name:'Amapá'},{code:'AM',name:'Amazonas'},
    {code:'BA',name:'Bahia'},{code:'CE',name:'Ceará'},{code:'DF',name:'Distrito Federal'},{code:'ES',name:'Espírito Santo'},
    {code:'GO',name:'Goiás'},{code:'MA',name:'Maranhão'},{code:'MT',name:'Mato Grosso'},{code:'MS',name:'Mato Grosso do Sul'},
    {code:'MG',name:'Minas Gerais'},{code:'PA',name:'Pará'},{code:'PB',name:'Paraíba'},{code:'PR',name:'Paraná'},
    {code:'PE',name:'Pernambuco'},{code:'PI',name:'Piauí'},{code:'RJ',name:'Rio de Janeiro'},{code:'RN',name:'Rio Grande do Norte'},
    {code:'RS',name:'Rio Grande do Sul'},{code:'RO',name:'Rondônia'},{code:'RR',name:'Roraima'},{code:'SC',name:'Santa Catarina'},
    {code:'SP',name:'São Paulo'},{code:'SE',name:'Sergipe'},{code:'TO',name:'Tocantins'}
  ];
  const sel = document.getElementById('uf');
  if (!sel) {
    console.warn("⚠️ select#uf não encontrado — aguardando DOM completo...");
    return false;
  }
  sel.innerHTML = '<option value="">Selecione</option>';
  ufs.forEach(u=>{
    const opt=document.createElement('option');
    opt.value=u.code;
    opt.textContent=`${u.code} — ${u.name}`;
    sel.appendChild(opt);
  });
  console.log("✅ UFs do CRM carregadas:", ufs.length);
  return true;
}

// Tenta carregar UFs com verificação de DOM pronto
(function(){
  function tryUFs(){
    if (!populateUFsSafe()){
      setTimeout(tryUFs,500);
    }
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', tryUFs);
  } else {
    tryUFs();
  }
})();

/* === Patch v0.5.3.7 — Sequência de Inicialização Restaurada === */
(function(){
  function initDarkMode() {
    const toggle = document.querySelector("#darkModeToggle");
    if (!toggle) return;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
    toggle.addEventListener("click", ()=>{
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
    console.log("🌙 Dark mode restaurado");
  }

  function initUFs() {
    const ufs = [
      {code:'AC',name:'Acre'},{code:'AL',name:'Alagoas'},{code:'AP',name:'Amapá'},{code:'AM',name:'Amazonas'},
      {code:'BA',name:'Bahia'},{code:'CE',name:'Ceará'},{code:'DF',name:'Distrito Federal'},{code:'ES',name:'Espírito Santo'},
      {code:'GO',name:'Goiás'},{code:'MA',name:'Maranhão'},{code:'MT',name:'Mato Grosso'},{code:'MS',name:'Mato Grosso do Sul'},
      {code:'MG',name:'Minas Gerais'},{code:'PA',name:'Pará'},{code:'PB',name:'Paraíba'},{code:'PR',name:'Paraná'},
      {code:'PE',name:'Pernambuco'},{code:'PI',name:'Piauí'},{code:'RJ',name:'Rio de Janeiro'},{code:'RN',name:'Rio Grande do Norte'},
      {code:'RS',name:'Rio Grande do Sul'},{code:'RO',name:'Rondônia'},{code:'RR',name:'Roraima'},{code:'SC',name:'Santa Catarina'},
      {code:'SP',name:'São Paulo'},{code:'SE',name:'Sergipe'},{code:'TO',name:'Tocantins'}
    ];
    const sel = document.getElementById("uf");
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecione</option>';
    ufs.forEach(u=>{
      const opt=document.createElement("option");
      opt.value=u.code;
      opt.textContent=`${u.code} — ${u.name}`;
      sel.appendChild(opt);
    });
    console.log("✅ UFs do CRM carregadas:", ufs.length);
  }

  function initSpecialties() {
    const base = "assets/data/specialties.json";
    const espSel = document.getElementById("especialidade");
    const subSel = document.getElementById("subespecialidade");
    if (!espSel || !subSel) return;
    fetch(base,{cache:"no-store"})
      .then(res=>res.json())
      .then(data=>{
        espSel.innerHTML="<option value=''>Selecione</option>";
        Object.keys(data).forEach(k=>{
          const opt=document.createElement("option");
          opt.value=k; opt.textContent=k;
          espSel.appendChild(opt);
        });
        espSel.addEventListener("change",()=>{
          const list=data[espSel.value]||[];
          subSel.innerHTML="<option value=''>Selecione</option>";
          list.forEach(s=>{
            const o=document.createElement("option");
            o.value=s; o.textContent=s;
            subSel.appendChild(o);
          });
        });
        console.log("✅ Especialidades carregadas com sucesso.");
      })
      .catch(e=>console.warn("⚠️ Erro ao carregar especialidades:",e.message));
  }

  function startAll() {
    initDarkMode();
    initUFs();
    initSpecialties();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAll);
  } else {
    startAll();
  }
})();
