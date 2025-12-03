// Configuração do calendário
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
    const sala = document.getElementById('sala').value;
    const responsavel = document.getElementById('responsavel').value;
    const periodo = document.getElementById('periodo').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;

    // Pega todos os checkboxes com name="diaSemana" que estão marcados
    const checkboxes = document.querySelectorAll('input[name="diaSemana"]:checked');
    // Transforma em um array de números (ex: [1, 3, 5] para Seg, Qua, Sex)
    const diasPermitidos = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (diasPermitidos.length === 0) {
        mostrarMensagem("Selecione pelo menos um dia da semana para repetir.", "danger");
        return;
    }

    if (!periodo) {
        mostrarMensagem("Selecione o período de agendamento!", "danger");
        return;
    }
    if (horaInicio >= horaFim) {
        mostrarMensagem("O horário de fim deve ser posterior ao início.", "danger");
        return;
    }

    const agora = new Date();
    agora.setSeconds(0, 0);

    let dataInicioStr, dataFimStr;
    const partes = periodo.split(" até ");
    dataInicioStr = partes[0].trim();
    dataFimStr = partes[1] ? partes[1].trim() : dataInicioStr;

    let diasParaSalvar = [];
    let diaAtual = dataInicioStr;
    
    // Função auxiliar para descobrir o dia da semana (0=Dom, 1=Seg... 6=Sab)
    function getDiaDaSemana(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        // Mês no JS começa em 0, por isso mes - 1
        const d = new Date(ano, mes - 1, dia);
        return d.getDay();
    }

    function somarDia(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        let data = new Date(ano, mes - 1, dia);
        data.setDate(data.getDate() + 1);
        return data.toISOString().split('T')[0];
    }
    
    while (diaAtual <= dataFimStr) {
        const diaSemanaAtual = getDiaDaSemana(diaAtual);
        // Se o dia atual NÃO estiver na lista de permitidos, pula para o próximo
        if (!diasPermitidos.includes(diaSemanaAtual)) {
            diaAtual = somarDia(diaAtual);
            continue; // Pula o resto do loop e volta para o while
        }
        const dataHoraAgendamento = new Date(`${diaAtual}T${horaInicio}`);
        
        if (dataHoraAgendamento < agora) {
            mostrarMensagem(`Não é possível agendar no passado: ${formatarDataBr(diaAtual)}.`, "danger");
            return;
        }
        
        if (verificarConflito(sala, diaAtual, horaInicio, horaFim)) {
            mostrarMensagem(`Sala já está ocupada no dia ${formatarDataBr(diaAtual)} (${horaInicio}-${horaFim}).`, "danger");
            return;
        }
        
        diasParaSalvar.push(diaAtual);
        diaAtual = somarDia(diaAtual);
    }
    
    if (diasParaSalvar.length === 0) {
        mostrarMensagem("Nenhum dia válido encontrado no intervalo selecionado para os dias da semana marcados.", "warning");
        return;
    }

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
        msgDiv.classList.add('d-block');
        
        if(mostrarMensagem.timeout) clearTimeout(mostrarMensagem.timeout);
        mostrarMensagem.timeout = setTimeout(() => { 
            msgDiv.classList.add('d-none'); 
            msgDiv.classList.remove('d-block');
        }, 4000);
    } else {
        alert(texto);
    }
}

function formatarDataBr(dataYMD) {
    if(!dataYMD) return "";
    const [ano, mes, dia] = dataYMD.split('-');
    return `${dia}/${mes}/${ano}`;
}

document.getElementById('sala').addEventListener('input', function(e) {
    // Substitui tudo que não for dígito por vazio
    this.value = this.value.replace(/\D/g, '');
});
