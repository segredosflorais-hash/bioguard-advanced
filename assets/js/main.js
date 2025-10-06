// Alternar visibilidade da senha
function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  input.type = input.type === "password" ? "text" : "password";
}

// Botões informativos (placeholders)
const infoData = {
  rapidez: {
    title: "Rapidez",
    content: "O BioGuard Sentinel processa dados clínicos em menos de 60 segundos, otimizando a tomada de decisão em urgência."
  },
  foco: {
    title: "Foco",
    content: "Auxílio preciso no controle da sepse, com base nas diretrizes ILAS e Surviving Sepsis Campaign."
  },
  confiabilidade: {
    title: "Confiabilidade",
    content: "Base científica sólida, auditoria humana e transparência total em cada resposta."
  }
};

function showInfo(type) {
  const section = document.getElementById("info-section");
  section.classList.remove("hidden");
  document.getElementById("info-title").textContent = infoData[type].title;
  document.getElementById("info-content").textContent = infoData[type].content;
}

document.getElementById("btn-rapidez").addEventListener("click", () => showInfo("rapidez"));
document.getElementById("btn-foco").addEventListener("click", () => showInfo("foco"));
document.getElementById("btn-confiabilidade").addEventListener("click", () => showInfo("confiabilidade"));

// Placeholder de login/cadastro
document.getElementById("userForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Login simulado: integração futura com backend Supabase.");
});

document.getElementById("btnCadastro").addEventListener("click", () => {
  alert("Cadastro simulado: integração futura com Supabase Auth.");
});
