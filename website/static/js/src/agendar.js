// Configuração do calendário de seleção de intervalo (Flatpickr)
flatpickr("#periodo", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "pt",
    altInput: true,
    altFormat: "d/m/Y",
    minDate: "today"
});


document.getElementById('agendarForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Captura dos dados
    const sala = document.getElementById('sala').value;
    const responsavel = document.getElementById('responsavel').value;
    const periodo = document.getElementById('periodo').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
   
    // Validações essenciais
    if (!periodo) {
        mostrarMensagem("Selecione o período de agendamento!", "danger");
        return;
    }
    if (horaInicio >= horaFim) {
        mostrarMensagem("O horário de fim deve ser posterior ao início.", "danger");
        return;
    }


    // Separação de Datas (Usa o separador traduzido " até ")
    let dataInicioStr, dataFimStr;
    const partes = periodo.split(" até ");
   
    dataInicioStr = partes[0].trim();
   
    // Se a parte [1] não existir, assume que é um agendamento de 1 dia
    dataFimStr = partes[1] ? partes[1].trim() : dataInicioStr;


    // Loop de Verificação de Conflito e Salvamento
    let diasParaSalvar = [];
    let diaAtual = dataInicioStr;
   
    // Função para somar 1 dia
    function somarDia(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        let data = new Date(ano, mes - 1, dia);
        data.setDate(data.getDate() + 1);
        return data.toISOString().split('T')[0];
    }
   
    while (diaAtual <= dataFimStr) {
        // Checa Conflito
        if (verificarConflito(sala, diaAtual, horaInicio, horaFim)) {
            mostrarMensagem(`Sala já está ocupada nesse horário e nesse dia ${formatarDataBr(diaAtual)}.`, "danger");
            return;
        }
       
        diasParaSalvar.push(diaAtual);
        diaAtual = somarDia(diaAtual);
    }
   
    // Salvamento no LocalStorage
    diasParaSalvar.forEach(dia => {
        const agendamento = {
            id: Date.now() + Math.random(),
            sala: sala,
            responsavel: responsavel,
            data: dia,
            inicio: horaInicio,
            fim: horaFim,
            descricao: document.getElementById('descricao').value
        };
        salvarNoLocalStorage(agendamento);
    });


    mostrarMensagem(`Sucesso! ${diasParaSalvar.length} dias agendados.`, "success");
    document.getElementById('agendarForm').reset();
});


// --- FUNÇÕES AUXILIARES ---


function verificarConflito(sala, data, inicio, fim) {
    const lista = JSON.parse(localStorage.getItem('listaAgendamentos')) || [];
    return lista.some(item =>
        item.sala === sala &&
        item.data === data &&
        (inicio < item.fim && fim > item.inicio)
    );
}


function salvarNoLocalStorage(item) {
    let lista = JSON.parse(localStorage.getItem('listaAgendamentos')) || [];
    lista.push(item);
    localStorage.setItem('listaAgendamentos', JSON.stringify(lista));
}


function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('mensagem');
    if (msgDiv) {
        msgDiv.textContent = texto;
        msgDiv.className = `alert alert-${tipo} mt-3`;
        msgDiv.classList.remove('d-none');
        setTimeout(() => { msgDiv.classList.add('d-none'); }, 4000);
    } else {
        alert(texto);
    }
}


function formatarDataBr(dataYMD) {
    if(!dataYMD) return "";
    const [ano, mes, dia] = dataYMD.split('-');
    return `${dia}/${mes}/${ano}`;
}
