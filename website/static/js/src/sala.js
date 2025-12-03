document.addEventListener('DOMContentLoaded', function() {
    const listaTbody = document.getElementById('listaAgendamentos');
    const inputFiltro = document.getElementById('filtroData');
    const btnFiltrar = document.getElementById('btnFiltrar');
    const btnVerTodos = document.getElementById('btnVerTodos');
    const msgVazio = document.getElementById('msgVazio');

    function formatarDataBr(dataYMD) {
        if (!dataYMD) return "";
        const [ano, mes, dia] = dataYMD.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    
    // Recebe uma data específica OU 'todos'
    function carregarAgendamentos(filtro = 'todos') {
        listaTbody.innerHTML = '';
        msgVazio.style.display = 'none';

        let agendamentos = JSON.parse(localStorage.getItem('listaAgendamentos')) || [];

        if (agendamentos.length === 0) {
            msgVazio.textContent = "Nenhum agendamento cadastrado no sistema.";
            msgVazio.style.display = 'block';
            return;
        }

        let agendamentosFiltrados = agendamentos;
        let textoFeedback = "";

        if (filtro === 'todos') {
            textoFeedback = "todos os agendamentos";
            inputFiltro.value = ''; 
        } else {
            agendamentosFiltrados = agendamentos.filter(ag => ag.data === filtro);
            textoFeedback = formatarDataBr(filtro);
        }
        
        agendamentosFiltrados.sort((a, b) => {
            if (a.data < b.data) return -1;
            if (a.data > b.data) return 1;
            if (a.inicio < b.inicio) return -1;
            if (a.inicio > b.inicio) return 1;
            return 0;
        });

        if (agendamentosFiltrados.length === 0) {
             msgVazio.textContent = `Nenhum agendamento encontrado para ${textoFeedback}.`;
             msgVazio.style.display = 'block';
             return;
        }

        agendamentosFiltrados.forEach(ag => {
            const linha = document.createElement('tr');
            const nomeSala = ag.sala ? ag.sala.trim() : "S/N";

            linha.innerHTML = `
                <td>${formatarDataBr(ag.data)}</td>
                <td><strong>${nomeSala}</strong></td>
                <td>${ag.inicio}</td>
                <td>${ag.fim}</td>
                <td>${ag.responsavel}</td>
                <td>${ag.descricao || '-'}</td>
            `;
            listaTbody.appendChild(linha);
        });
    }

    btnFiltrar.addEventListener('click', () => {
        const dataSelecionada = inputFiltro.value;
        if (dataSelecionada) {
            carregarAgendamentos(dataSelecionada);
        } else {
            alert("Por favor, selecione uma data no calendário.");
        }
    });

    // Ver Todos
    if (btnVerTodos) {
        btnVerTodos.addEventListener('click', () => {
            carregarAgendamentos('todos');
        });
    }

    carregarAgendamentos('todos'); 
});
