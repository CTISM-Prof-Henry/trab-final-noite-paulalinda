document.addEventListener('DOMContentLoaded', function() {
    const listaTbody = document.getElementById('listaAgendamentos');
    const inputFiltro = document.getElementById('filtroData');
    const btnFiltrar = document.getElementById('btnFiltrar');
    const msgVazio = document.getElementById('msgVazio');

    // Função para formatar a data (igual à que usamos no agendar.js)
    function formatarDataBr(dataYMD) {
        if (!dataYMD) return "";
        const [ano, mes, dia] = dataYMD.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    
    // Função principal que carrega e exibe os dados
    function carregarAgendamentos(dataFiltro = null) {
        listaTbody.innerHTML = '';
        msgVazio.style.display = 'none';

        // 1. LER DADOS DO LOCALSTORAGE
        let agendamentos = JSON.parse(localStorage.getItem('listaAgendamentos')) || [];

        if (agendamentos.length === 0) {
            msgVazio.textContent = "Nenhum agendamento cadastrado no sistema.";
            msgVazio.style.display = 'block';
            return;
        }

        // 2. FILTRAR
        let agendamentosFiltrados = agendamentos;
        if (dataFiltro) {
            agendamentosFiltrados = agendamentos.filter(ag => ag.data === dataFiltro);
        } else {
             // Exibe apenas agendamentos de hoje se nenhum filtro for aplicado inicialmente
             const hoje = new Date().toISOString().split('T')[0];
             agendamentosFiltrados = agendamentos.filter(ag => ag.data === hoje);
             inputFiltro.value = hoje; // Pré-preenche o filtro com a data de hoje
        }
        
        // 3. ORDENAR (Por data e depois por hora de início)
        agendamentosFiltrados.sort((a, b) => {
            if (a.data < b.data) return -1;
            if (a.data > b.data) return 1;
            // Se as datas são iguais, ordena pela hora
            if (a.inicio < b.inicio) return -1;
            if (a.inicio > b.inicio) return 1;
            return 0;
        });

        // 4. PREENCHER A TABELA
        if (agendamentosFiltrados.length === 0) {
             msgVazio.textContent = `Nenhum agendamento encontrado para ${formatarDataBr(dataFiltro)}.`;
             msgVazio.style.display = 'block';
             return;
        }

        agendamentosFiltrados.forEach(ag => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${formatarDataBr(ag.data)}</td>
                <td><strong>${ag.sala}</strong></td>
                <td>${ag.inicio}</td>
                <td>${ag.fim}</td>
                <td>${ag.responsavel}</td>
                <td>${ag.descricao || '-'}</td>
            `;
            listaTbody.appendChild(linha);
        });
    }

    // --- EVENT LISTENERS ---
    
    // 1. Evento de clique no botão Filtrar
    btnFiltrar.addEventListener('click', () => {
        const dataSelecionada = inputFiltro.value;
        if (dataSelecionada) {
            carregarAgendamentos(dataSelecionada);
        } else {
             // Se o campo estiver vazio, recarrega a lista sem filtro
             carregarAgendamentos(null);
        }
    });

    // 2. Carregar a lista automaticamente ao abrir a página (mostrando agendamentos de hoje)
    carregarAgendamentos(); 
});