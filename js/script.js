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


if (dataHoje) {
  const hoje = new Date();
  dataHoje.textContent = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function atualizarResumo() {
  const concluidas = tarefas.filter(t => t.concluida).length;
  if (totalTarefas) totalTarefas.textContent = tarefas.length;
  if (totalConcluidas) totalConcluidas.textContent = concluidas;
  if (totalPendentes) totalPendentes.textContent = tarefas.length - concluidas;
}

function renderizar() {
  listaTarefas.innerHTML = ''; 

  if (tarefas.length === 0) {
    if (msgVazio) msgVazio.style.display = 'block';
  } else {
    if (msgVazio) msgVazio.style.display = 'none';
  }

  tarefas.forEach((tarefa, index) => {
    const li = document.createElement('li');
    li.className = 'item-tarefa';

    if (tarefa.concluida) {
      li.classList.add('concluida');
    }

    const info = document.createElement('div');
    info.innerHTML = `
      <strong>${tarefa.titulo}</strong> 
      <small>(${tarefa.data} ${tarefa.horario ? 'às ' + tarefa.horario : ''}) - Prioridade: ${tarefa.prioridade}</small>
      ${tarefa.descricao ? `<p>\${tarefa.descricao}</p>` : ''}
    `;

    const acoes = document.createElement('div');

    const btnConcluir = document.createElement('button');
    btnConcluir.textContent = tarefa.concluida ? 'Desfazer' : 'Concluir';
    btnConcluir.type = 'button';
    btnConcluir.onclick = () => alternarStatus(index);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.type = 'button';
    btnExcluir.onclick = () => removerTarefa(index);

    acoes.appendChild(btnConcluir);
    acoes.appendChild(btnExcluir);

    li.appendChild(info);
    li.appendChild(acoes);
    listaTarefas.appendChild(li);
  });

  atualizarResumo();
}

if (formTarefa) {
  formTarefa.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const novaTarefa = {
      titulo: campoTitulo.value.trim(),
      descricao: campoDescricao ? campoDescricao.value.trim() : '',
      data: campoData.value,
      horario: campoHorario ? campoHorario.value : '',
      prioridade: campoPrioridade ? campoPrioridade.value : 'normal',
      concluida: false
    };

    tarefas.push(novaTarefa);
    formTarefa.reset();
    renderizar();
  });
}

function alternarStatus(index) {
  tarefas[index].concluida = !tarefas[index].concluida;
  renderizar();
}

function removerTarefa(index) {
  tarefas.splice(index, 1);
  renderizar();
}

renderizar();