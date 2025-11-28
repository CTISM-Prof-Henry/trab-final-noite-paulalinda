export class AgendamentoLogic {

    // Lógica extraída de agendar.js (validarHorario)
    validarHorario(horaInicio, horaFim) {
        // Retorna true se o fim for maior que o início
        return horaInicio < horaFim;
    }

    // Lógica extraída de formatarDataBr
    formatarDataBr(dataYMD) {
        if (!dataYMD) return "";
        const [ano, mes, dia] = dataYMD.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Lógica extraída de somarDia
    somarDia(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        let data = new Date(ano, mes - 1, dia);
        data.setDate(data.getDate() + 1);
        return data.toISOString().split('T')[0];
    }

    // Lógica adaptada de verificarConflito
    verificarConflito(listaAgendamentos, sala, data, inicio, fim) {
        if (!listaAgendamentos) return false;

        return listaAgendamentos.some(item =>
            item.sala === sala &&
            item.data === data &&
            (inicio < item.fim && fim > item.inicio)
        );
    }
}