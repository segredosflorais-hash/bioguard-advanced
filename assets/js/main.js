/**
 * 🧭 PROTOCOLO DE CONFIABILIDADE – BIOGUARD SENTINEL
 * Módulo JS unificado para Login + Recuperação de Senha
 * Responsável por: 
 *  - Controle do campo de senha (botão "olho")
 *  - Simulação de autenticação segura
 *  - Simulação de recuperação de senha via e-mail
 */

// ========== Controle de visibilidade da senha ==========
const togglePassword = document.querySelector("#togglePassword");
const passwordField = document.querySelector("#password");

if (togglePassword && passwordField) {
  togglePassword.addEventListener("click", () => {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
}

// ========== Simulação de Login Seguro ==========
const loginForm = document.querySelector(".login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullname = document.querySelector("#fullname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!fullname || !email || !password) {
      alert("⚠️ Todos os campos são obrigatórios.");
      return;
    }

    // Simulação de autenticação (API futura)
    alert(`✅ Bem-vindo(a), Dr(a). ${fullname}!\n\nAutenticação segura realizada com sucesso.`);

    console.log(`[AUDIT] Login médico autenticado: ${fullname} (${email})`);
  });
}

// ========== Recuperação de Senha ==========
const recoveryForm = document.querySelector(".recovery-form");

if (recoveryForm) {
  recoveryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#recovery-email").value.trim();

    if (!email) {
      alert("⚠️ Informe o e-mail cadastrado para recuperar sua senha.");
      return;
    }

    // Simulação de envio de e-mail (futuro backend seguro)
    alert(`📧 Um link de redefinição foi enviado para:\n${email}\n\nVerifique sua caixa de entrada.`);

    console.log(`[AUDIT] Solicitação de recuperação de senha: ${email}`);
  });
}
