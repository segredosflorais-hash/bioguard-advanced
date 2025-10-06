// Main interactivity for Landing + Auth modals
document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // explain panel
  const explainPanel = document.getElementById('explain-panel');
  const explainTitle = document.getElementById('explain-title');
  const explainBody = document.getElementById('explain-body');

  document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-target');
      explainTitle.textContent = btn.textContent;
      // placeholders editáveis
      if (t === 'rapidez') {
        explainBody.innerHTML = "<p><strong>Rapidez</strong>: Resultado em menos de 60 segundos (fluxo otimizado). Texto placeholder — edite conforme preferir.</p>";
      } else if (t === 'foco') {
        explainBody.innerHTML = "<p><strong>Auxílio no controle da sepse</strong>: Interface otimizada para decisões rápidas e contextualizadas. Placeholder editável.</p>";
      } else {
        explainBody.innerHTML = "<p><strong>Confiabilidade</strong>: Sanitize triplo, revisão humana 10% e audit log completo. Placeholder editável.</p>";
      }
      explainPanel.classList.remove('hidden');
      explainPanel.setAttribute('aria-hidden', 'false');
    });
  });

  // close explain
  document.querySelectorAll('.explain-panel .close-x').forEach(b => b.addEventListener('click', () => {
    explainPanel.classList.add('hidden');
    explainPanel.setAttribute('aria-hidden', 'true');
  }));

  // modal logic (login/signup)
  const authModal = document.getElementById('auth-modal');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');

  function openAuth(mode = 'login') {
    authModal.classList.remove('hidden');
    authModal.setAttribute('aria-hidden', 'false');
    if (mode === 'login') {
      formLogin.classList.remove('hidden');
      formSignup.classList.add('hidden');
    } else {
      formLogin.classList.add('hidden');
      formSignup.classList.remove('hidden');
    }
  }

  function closeAuth() {
    authModal.classList.add('hidden');
    authModal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('[data-open="login"]').forEach(el => el.addEventListener('click', () => openAuth('login')));
  document.querySelectorAll('[data-open="signup"]').forEach(el => el.addEventListener('click', () => openAuth('signup')));
  document.querySelectorAll('.modal .close-x').forEach(el => el.addEventListener('click', closeAuth));
  document.querySelectorAll('[data-switch]').forEach(b => b.addEventListener('click', ev => {
    openAuth(ev.target.getAttribute('data-switch'));
  }));

  // eye toggle for password fields (delegation)
  document.querySelectorAll('.eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle');
      const input = document.getElementById(targetId);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
  });

  // demo search (placeholder)
  document.getElementById('demo-search')?.addEventListener('click', () => {
    alert('Simulação: busca de literatura iniciada (placeholder). Em produção, chamará /api/sepsis/literature.');
  });

  // basic form submit prevention (placeholders)
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login (placeholder). Integre com Supabase Auth no backend.');
  });
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Cadastro (placeholder). Integre validação CRM e Supabase no backend.');
  });
});
