// --- BioGuard Sentinel: Supabase Login ---
document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (!email || !password) return alert("Por favor, preencha e-mail e senha.");

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert("Erro no login: " + error.message);
      } else {
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
      }
    });
  }
});

function togglePassword() {
  const field = document.getElementById("password");
  field.type = field.type === "password" ? "text" : "password";
}
