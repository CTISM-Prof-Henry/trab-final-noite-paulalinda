import { AgendamentoLogic } from "../src/definitions.js";

function testaFormatacaoData(assert) {
    let logica = new AgendamentoLogic();
    assert.equal(logica.formatarDataBr('2025-12-25'), '25/12/2025', "Deve formatar YYYY-MM-DD para DD/MM/YYYY");
    assert.equal(logica.formatarDataBr(""), "", "Deve retornar string vazia se não houver data");
}

function testaValidacaoHorario(assert) {
    let logica = new AgendamentoLogic();
    assert.true(logica.validarHorario('08:00', '10:00'), "08:00 antes de 10:00 deve ser válido");
    assert.false(logica.validarHorario('14:00', '13:00'), "14:00 antes de 13:00 deve ser inválido");
    assert.false(logica.validarHorario('10:00', '10:00'), "Horários iguais devem retornar false");
}

function testaSomarDia(assert) {
    let logica = new AgendamentoLogic();

    // Teste simples (mesmo mês)
    assert.equal(logica.somarDia('2025-11-28'), '2025-11-29', "Deve somar 1 dia corretamente");

    // Teste de virada de mês/ano (muito importante para garantir que o Date funciona)
    assert.equal(logica.somarDia('2025-12-31'), '2026-01-01', "Deve virar o ano corretamente");
}

function testaConflitoDeAgendamento(assert) {
    let logica = new AgendamentoLogic();
    let bancoDeDadosSimulado = [
        { sala: '101', data: '2025-11-20', inicio: '08:00', fim: '10:00' }
    ];

    assert.true(logica.verificarConflito(bancoDeDadosSimulado, '101', '2025-11-20', '08:00', '10:00'), "Deve detectar conflito exato");
    assert.false(logica.verificarConflito(bancoDeDadosSimulado, '103', '2025-11-20', '08:00', '10:00'), "Sem conflito sala diferente");
    assert.false(logica.verificarConflito(bancoDeDadosSimulado, '101', '2025-11-20', '10:00', '12:00'), "Sem conflito horário posterior");
    assert.true(logica.verificarConflito(bancoDeDadosSimulado, '101', '2025-11-20', '09:00', '11:00'), "Conflito parcial");
}

QUnit.module("AgendamentoLogic", () => {
    QUnit.test("testa formatação de data", assert => testaFormatacaoData(assert));
    QUnit.test("testa validação de horários", assert => testaValidacaoHorario(assert));
    QUnit.test("testa soma de dias", assert => testaSomarDia(assert));
    QUnit.test("testa conflitos de agendamento", assert => testaConflitoDeAgendamento(assert));
});