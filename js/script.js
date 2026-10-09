const formTarefa = document.getElementById('formTarefa');
const campoId = document.getElementById('campoId');
const campoTitulo = document.getElementById('campoTitulo');
const campoDescricao = document.getElementById('campoDescricao');
const campoData = document.getElementById('campoData');
const campoHorario = document.getElementById('campoHorario');
const campoPrioridade = document.getElementById('campoPrioridade');

const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

const listaTarefas = document.getElementById('listaTarefas');
const msgVazio = document.getElementById('msgVazio');

const totalTarefas = document.getElementById('totalTarefas');
const totalConcluidas = document.getElementById('totalConcluidas');
const totalPendentes = document.getElementById('totalPendentes');
const dataHoje = document.getElementById('dataHoje');

let tarefas = [];