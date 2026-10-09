const formTarefa = document.getElementById('formTarefa');
const campoId = document.getElementById('campoId');
const campoTitulo = document.getElementById('campoTitulo');
const campoEmoji = document.getElementById('campoEmoji');
const campoDescricao = document.getElementById('campoDescricao');
const campoData = document.getElementById('campoData');
const campoHorario = document.getElementById('campoHorario');
const campoPrioridade = document.getElementById('campoPrioridade');
const campoCor = document.getElementById('campoCor');

const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

const listaTarefas = document.getElementById('listaTarefas');
const msgVazio = document.getElementById('msgVazio');
const tituloDia = document.getElementById('tituloDia');
const seletorEmoji = document.getElementById('seletorEmoji');

const gradeCalendario = document.getElementById('gradeCalendario');
const tituloMes = document.getElementById('tituloMes');
const btnMesAnterior = document.getElementById('btnMesAnterior');
const btnProximoMes = document.getElementById('btnProximoMes');

const gradeSemana = document.getElementById('gradeSemana');
const tituloSemana = document.getElementById('tituloSemana');
const btnSemanaAnterior = document.getElementById('btnSemanaAnterior');
const btnProximaSemana = document.getElementById('btnProximaSemana');

const totalTarefas = document.getElementById('totalTarefas');
const totalConcluidas = document.getElementById('totalConcluidas');
const totalPendentes = document.getElementById('totalPendentes');
const dataHoje = document.getElementById('dataHoje');

const CHAVE_TAREFAS = 'minhasTarefas';
const CHAVE_COR = 'minhaCor';

const EMOJIS = ['📝', '📚', '💻', '🏋️', '🏃', '🍽️', '🛒', '🧹', '💼', '📞', '🎂', '🎉',
                '✈️', '🏥', '💊', '💰', '🎮', '🎵', '🧘', '🚗', '⭐', '❤️', '🐶', '📅'];
const EMOJI_PADRAO = '📝';

const NOMES_MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const NOMES_DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

let tarefas = [];

const hoje = new Date();

// Dia selecionado no calendário (texto AAAA-MM-DD)
let diaSelecionado = dataParaTexto(hoje);
// Mês que aparece no calendário (sempre o dia 1)
let mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
// Qualquer data dentro da semana que aparece no planejador
let dataDaSemana = new Date(hoje);

if (dataHoje) {
  dataHoje.textContent = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function dataParaTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function textoParaData(texto) {
  const partes = texto.split('-');
  return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
}

function somarDias(data, quantidade) {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + quantidade);
  return nova;
}

// Mostra a data como "8/10/2026"
function formatarData(texto) {
  const d = textoParaData(texto);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Evita que texto digitado vire código HTML
function limparTexto(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emojiDa(tarefa) {
  return tarefa.emoji ? tarefa.emoji : EMOJI_PADRAO;
}

function buscarTarefa(id) {
  return tarefas.find(t => t.id === id);
}

// Devolve só as tarefas de um dia, ordenadas por horário
function tarefasDoDia(dia) {
  return tarefas
    .filter(t => t.data === dia)
    .sort((a, b) => (a.horario || '99:99').localeCompare(b.horario || '99:99'));
}

function salvarTarefas() {
  localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefas));
}

function carregarTarefas() {
  const textoSalvo = localStorage.getItem(CHAVE_TAREFAS);
  tarefas = textoSalvo ? JSON.parse(textoSalvo) : [];
}

function atualizarResumo() {
  const concluidas = tarefas.filter(t => t.concluida).length;
  if (totalTarefas) totalTarefas.textContent = tarefas.length;
  if (totalConcluidas) totalConcluidas.textContent = concluidas;
  if (totalPendentes) totalPendentes.textContent = tarefas.length - concluidas;
}

function textoEmojisDoDia(listaDoDia) {
  const usados = [];
  listaDoDia.forEach(t => {
    if (!usados.includes(emojiDa(t))) usados.push(emojiDa(t));
  });
  return usados.slice(0, 3).join('') + (usados.length > 3 ? '+' : '');
}

function desenharCalendario() {
  gradeCalendario.innerHTML = '';

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();
  tituloMes.textContent = `${NOMES_MESES[mes]} ${ano}`;

  // O calendário começa na segunda: calcula quantos dias do mês anterior aparecem
  const primeiroDia = new Date(ano, mes, 1);
  const diasAntes = (primeiroDia.getDay() + 6) % 7;
  const inicio = somarDias(primeiroDia, -diasAntes);

  for (let i = 0; i < 42; i++) {
    const data = somarDias(inicio, i);
    const texto = dataParaTexto(data);
    const doDia = tarefasDoDia(texto);

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.dataset.dia = texto;

    const numero = document.createElement('span');
    numero.className = 'numero';
    numero.textContent = data.getDate();
    botao.appendChild(numero);

    if (doDia.length > 0) {
      const emojis = document.createElement('span');
      emojis.className = 'emojis';
      emojis.textContent = textoEmojisDoDia(doDia);
      botao.appendChild(emojis);
      botao.classList.add('tem-tarefa');
    }

    if (data.getMonth() !== mes) botao.classList.add('outro-mes');
    if (texto === dataParaTexto(hoje)) botao.classList.add('hoje');
    if (texto === diaSelecionado) botao.classList.add('selecionado');

    botao.addEventListener('click', () => {
      diaSelecionado = texto;
      dataDaSemana = textoParaData(texto);
      mesAtual = new Date(data.getFullYear(), data.getMonth(), 1);
      campoData.value = texto;
      desenharTudo();
    });

    gradeCalendario.appendChild(botao);
  }
}

function renderizar() {
  listaTarefas.innerHTML = '';
  tituloDia.textContent = `Tarefas de ${formatarData(diaSelecionado)}`;

  const doDia = tarefasDoDia(diaSelecionado);

  if (doDia.length === 0) {
    if (msgVazio) msgVazio.style.display = 'block';
  } else {
    if (msgVazio) msgVazio.style.display = 'none';
  }

  doDia.forEach(tarefa => {
    const li = document.createElement('li');
    li.className = `item-tarefa prioridade-${tarefa.prioridade}`;

    if (tarefa.concluida) {
      li.classList.add('concluida');
    }

    const info = document.createElement('div');
      info.innerHTML = `
      <strong>${emojiDa(tarefa)} ${limparTexto(tarefa.titulo)}</strong>
      <small>(${tarefa.horario ? 'às ' + tarefa.horario : 'sem horário'}) - Prioridade: ${tarefa.prioridade}</small>
      ${tarefa.descricao ? `<p>${limparTexto(tarefa.descricao)}</p>` : ''}
    `;

    const acoes = document.createElement('div');

    const btnConcluir = document.createElement('button');
    btnConcluir.textContent = tarefa.concluida ? 'Desfazer' : 'Concluir';
    btnConcluir.type = 'button';
    btnConcluir.onclick = () => alternarStatus(tarefa.id);

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.type = 'button';
    btnEditar.onclick = () => editarTarefa(tarefa.id);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.type = 'button';
    btnExcluir.onclick = () => removerTarefa(tarefa.id);

    acoes.appendChild(btnConcluir);
    acoes.appendChild(btnEditar);
    acoes.appendChild(btnExcluir);

    li.appendChild(info);
    li.appendChild(acoes);
    listaTarefas.appendChild(li);
  });

  atualizarResumo();
  desenharCalendario();
}

function dataInicioDaSemana() {
  const voltar = (dataDaSemana.getDay() + 6) % 7;
  return somarDias(dataDaSemana, -voltar);
}

// Monta o HTML de uma tarefa editável. data-campo = o que o campo edita, data-id = qual tarefa
function htmlTarefaEditavel(t, dataDaLinha) {
  const opcoesPrioridade = ['normal', 'alta', 'baixa']
    .map(p => `<option value="${p}" ${p === t.prioridade ? 'selected' : ''}>${p}</option>`)
    .join('');

  // Select para mover a tarefa para outro dia da semana
  let opcoesDia = '';
  for (let d = 0; d < 7; d++) {
    const dia = somarDias(dataInicioDaSemana(), d);
    const textoDia = dataParaTexto(dia);
    opcoesDia += `<option value="${textoDia}" ${textoDia === dataDaLinha ? 'selected' : ''}>${NOMES_DIAS[dia.getDay()]} ${dia.getDate()}</option>`;
  }

  return `
    <div class="edita-tarefa ${t.concluida ? 'concluida' : ''}">
      <input type="checkbox" data-campo="concluida" data-id="${t.id}" ${t.concluida ? 'checked' : ''} title="Concluída">
      <input type="text" class="campo-emoji" data-campo="emoji" data-id="${t.id}" value="${limparTexto(emojiDa(t))}" maxlength="8" title="Emoji">
      <input type="text" class="campo-titulo" data-campo="titulo" data-id="${t.id}" value="${limparTexto(t.titulo)}" maxlength="100" title="Título">
      <input type="time" class="campo-horario" data-campo="horario" data-id="${t.id}" value="${t.horario}" title="Horário">
      <select data-campo="prioridade" data-id="${t.id}" title="Prioridade">${opcoesPrioridade}</select>
      <select data-campo="dia" data-id="${t.id}" title="Mover para outro dia">${opcoesDia}</select>
      <button type="button" data-excluir="${t.id}" title="Excluir">×</button>
    </div>
  `;
}

function desenharSemana() {
  const segunda = dataInicioDaSemana();
  const domingo = somarDias(segunda, 6);

  tituloSemana.textContent = `${formatarData(dataParaTexto(segunda))} a ${formatarData(dataParaTexto(domingo))}`;

  let html = '';

  for (let i = 0; i < 7; i++) {
    const data = somarDias(segunda, i);
    const texto = dataParaTexto(data);
    const doDia = tarefasDoDia(texto);

    let tarefasHtml = '<p class="dia-livre">Dia livre</p>';
    if (doDia.length > 0) {
      tarefasHtml = doDia.map(t => htmlTarefaEditavel(t, texto)).join('');
    }

    html += `
      <div class="dia-semana-card ${texto === dataParaTexto(hoje) ? 'hoje' : ''}">
        <strong>${NOMES_DIAS[data.getDay()]}, ${data.getDate()}</strong>
        ${tarefasHtml}
        <button type="button" data-adicionar="${texto}">＋ Adicionar tarefa</button>
      </div>
    `;
  }

  gradeSemana.innerHTML = html;
}

// Chamada quando a pessoa muda um campo dentro da semana
function editarCampoDaSemana(campo) {
  const tarefa = buscarTarefa(Number(campo.dataset.id));
  if (!tarefa) return;

  const qual = campo.dataset.campo;

  if (qual === 'titulo') tarefa.titulo = campo.value.trim() || 'Sem título';
  if (qual === 'emoji') tarefa.emoji = campo.value.trim() || EMOJI_PADRAO;
  if (qual === 'horario') tarefa.horario = campo.value;
  if (qual === 'prioridade') tarefa.prioridade = campo.value;
  if (qual === 'dia') tarefa.data = campo.value;
  if (qual === 'concluida') {
    tarefa.concluida = campo.checked;
    // risca o texto na hora, sem redesenhar a semana
    campo.parentNode.classList.toggle('concluida', campo.checked);
  }

  salvarTarefas();
  renderizar();

  // A semana só é redesenhada quando a ordem muda 
  if (qual === 'dia' || qual === 'horario') {
    desenharSemana();
  }
}

function adicionarTarefaNaSemana(dia) {
  const nova = {
    id: Date.now(),
    titulo: 'Nova tarefa',
    emoji: EMOJI_PADRAO,
    descricao: '',
    data: dia,
    horario: '',
    prioridade: 'normal',
    concluida: false
  };
  tarefas.push(nova);

  salvarTarefas();
  desenharTudo();

  const campo = document.querySelector(`#gradeSemana [data-campo="titulo"][data-id="${nova.id}"]`);
  if (campo) {
    campo.focus();
    campo.select();
  }
}

function montarSeletorEmoji() {
  EMOJIS.forEach(emoji => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = emoji;
    botao.onclick = () => escolherEmoji(emoji);
    seletorEmoji.appendChild(botao);
  });
}

function escolherEmoji(emoji) {
  campoEmoji.value = emoji;
  seletorEmoji.querySelectorAll('button').forEach(botao => {
    botao.classList.toggle('escolhido', botao.textContent === emoji);
  });
}

function mudarCor(cor) {
  document.body.className = `tema-${cor}`;
  localStorage.setItem(CHAVE_COR, cor);
}

if (formTarefa) {
  formTarefa.addEventListener('submit', function(event) {
    event.preventDefault();

    const dados = {
      titulo: campoTitulo.value.trim(),
      emoji: campoEmoji.value.trim() || EMOJI_PADRAO,
      descricao: campoDescricao.value.trim(),
      data: campoData.value,
      horario: campoHorario.value,
      prioridade: campoPrioridade.value
    };

    if (campoId.value === '') {
      tarefas.push({ id: Date.now(), ...dados, concluida: false });
    } else {
      Object.assign(buscarTarefa(Number(campoId.value)), dados);
    }

    diaSelecionado = dados.data;
    dataDaSemana = textoParaData(dados.data);
    mesAtual = new Date(dataDaSemana.getFullYear(), dataDaSemana.getMonth(), 1);

    salvarTarefas();
    limparFormulario();
    desenharTudo();
  });
}

function editarTarefa(id) {
  const tarefa = buscarTarefa(id);

  campoId.value = tarefa.id;
  campoTitulo.value = tarefa.titulo;
  escolherEmoji(emojiDa(tarefa));
  campoDescricao.value = tarefa.descricao;
  campoData.value = tarefa.data;
  campoHorario.value = tarefa.horario;
  campoPrioridade.value = tarefa.prioridade;

  btnSalvar.textContent = 'Atualizar tarefa';
  btnCancelar.hidden = false;
  campoTitulo.focus();
}

function limparFormulario() {
  formTarefa.reset();
  campoId.value = '';
  escolherEmoji(EMOJI_PADRAO);
  campoData.value = diaSelecionado;
  btnSalvar.textContent = 'Salvar tarefa';
  btnCancelar.hidden = true;
}

function alternarStatus(id) {
  const tarefa = buscarTarefa(id);
  tarefa.concluida = !tarefa.concluida;
  salvarTarefas();
  desenharTudo();
}

function removerTarefa(id) {
  if (!confirm('Tem certeza que quer excluir esta tarefa?')) return;

  tarefas = tarefas.filter(t => t.id !== id);
  salvarTarefas();
  limparFormulario();
  desenharTudo();
}

function desenharTudo() {
  renderizar();
  desenharSemana();
}

btnCancelar.addEventListener('click', limparFormulario);

btnMesAnterior.addEventListener('click', () => {
  mesAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1);
  desenharCalendario();
});
btnProximoMes.addEventListener('click', () => {
  mesAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1);
  desenharCalendario();
});

btnSemanaAnterior.addEventListener('click', () => {
  dataDaSemana = somarDias(dataDaSemana, -7);
  desenharSemana();
});
btnProximaSemana.addEventListener('click', () => {
  dataDaSemana = somarDias(dataDaSemana, 7);
  desenharSemana();
});

// Edição dentro da semana ("change" = terminou de editar o campo)
gradeSemana.addEventListener('change', event => {
  if (event.target.dataset.campo) editarCampoDaSemana(event.target);
});

gradeSemana.addEventListener('click', event => {
  const botaoAdd = event.target.closest('[data-adicionar]');
  if (botaoAdd) {
    adicionarTarefaNaSemana(botaoAdd.dataset.adicionar);
    return;
  }

  const botaoExcluir = event.target.closest('[data-excluir]');
  if (botaoExcluir) removerTarefa(Number(botaoExcluir.dataset.excluir));
});

campoCor.addEventListener('change', () => mudarCor(campoCor.value));

const corSalva = localStorage.getItem(CHAVE_COR);
if (corSalva) {
  mudarCor(corSalva);
  campoCor.value = corSalva;
}

montarSeletorEmoji();
carregarTarefas();
campoData.value = diaSelecionado;
escolherEmoji(EMOJI_PADRAO);
desenharTudo();