(() => {
  const form        = document.getElementById('cadastroForm');
  const sala        = document.getElementById('sala');
  const bloco       = document.getElementById('bloco');
  const tipo        = document.getElementById('tipo');
  const capacidade  = document.getElementById('capacidade');
  const btnCancelar = document.getElementById('btnCancelar');
  const msgBox      = document.getElementById('mensagem');
  const listaWrap   = document.getElementById('lista-cadastros');


  const cadastros = [];


  function showMsg(texto, ok = true) {
    msgBox.classList.remove('d-none', 'alert-danger', 'alert-success');
    msgBox.classList.add(ok ? 'alert-success' : 'alert-danger');
    msgBox.textContent = texto;
    clearTimeout(showMsg._t);
    showMsg._t = setTimeout(() => msgBox.classList.add('d-none'), 3000);
  }


  function resetErrors() {
    [sala, bloco, tipo, capacidade].forEach(el => el.classList.remove('is-invalid'));
  }


  function renderTabela() {
    if (!cadastros.length) { listaWrap.innerHTML = ''; return; }
    const rows = cadastros.map(c => `
      <tr>
        <td>${c.sala}</td>
        <td>${c.bloco}</td>
        <td>${c.tipo}</td>
        <td>${c.capacidade}</td>
      </tr>
    `).join('');


    listaWrap.innerHTML = `
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead class="table-light">
                <tr>
                  <th>Sala</th>
                  <th>Bloco</th>
                  <th>Tipo</th>
                  <th>Capacidade</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetErrors();


    const vSala = (sala.value || '').trim();
    const vBloco = (bloco.value || '').trim();
    const vTipo = (tipo.value || '').trim();
    const vCap = (capacidade.value || '').trim();


    let ok = true;
    if (!vSala) { sala.classList.add('is-invalid'); ok = false; }
    if (!vBloco || vBloco.toLowerCase() === 'selecione') { bloco.classList.add('is-invalid'); ok = false; }
    if (!vTipo  || vTipo.toLowerCase() === 'selecione')  { tipo.classList.add('is-invalid'); ok = false; }
    if (!vCap   || vCap.toLowerCase() === 'selecione')   { capacidade.classList.add('is-invalid'); ok = false; }


    if (!ok) { showMsg('Preencha todos os campos obrigatórios.', false); return; }


    cadastros.push({
      sala: vSala,
      bloco: vBloco,
      tipo: vTipo,
      capacidade: vCap
    });


    renderTabela();
    form.reset();
    sala.focus();
  });


  btnCancelar.addEventListener('click', () => {
    form.reset();
    resetErrors();
    showMsg('Formulário limpo.', true);
  });
})();
