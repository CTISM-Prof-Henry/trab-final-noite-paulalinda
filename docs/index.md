# Sistema de Agendamento de Salas – Colégio Politécnico

Link do tutorial: https://ctism-prof-henry.github.io/trab-final-noite-paulalinda/

## Descrição
O sistema tem como objetivo **gerenciar o agendamento de salas** do Colégio Politécnico, permitindo que professores e funcionários reservem salas para aulas, reuniões ou atividades.  
O sistema **não possui login** e as ações de **cadastrar, descadastrar e agendar** podem ser realizadas pela interface web.

---

## Funcionalidades

- **Cadastrar sala:**  
  Permite adicionar uma nova sala ao sistema, informando:
  - Bloco (ex: Bloco A)
  - Número da sala (ex: 204)
  - Capacidade (número de pessoas)
  - Tipo (laboratório ou sala comum)

- **Descadastrar sala:**  
  Remove uma sala cadastrada.

- **Listar salas:**  
  Exibe todas as salas cadastradas, com suas informações (bloco, tipo e capacidade).

- **Agendar sala:**  
  Permite reservar uma sala informando:
  - Sala desejada  
  - Data inicial e data final  
  - Intervalo de horas (ex: das 8h às 10h)  
  - Responsável pelo agendamento (nome do professor ou setor)

- **Cancelar agendamento:**  
  Permite remover um agendamento feito (somente quem criou o agendamento ou o administrador pode cancelar). 

---

## Público
- **Professores e funcionários:** podem cadastrar salas e realizar agendamentos.  
- **Administrador:** pode editar ou excluir agendamentos.

---

## Como executar

### Caso o projeto seja em HTML/JS/CSS puro (sem backend)
1. Baixe a pasta do projeto (ZIP ou GitHub).  
2. Extraia o conteúdo em uma pasta do computador.  
3. Abra o arquivo `index.html` em um navegador.  
4. O sistema abrirá a interface principal.  

