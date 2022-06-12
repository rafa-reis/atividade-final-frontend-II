document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página!");
    window.location.href = "index.html";
    return;
  }

  pegarDadosUsuario();
});

let usuarioLogado: string | null = localStorage.getItem("usuarioLogado");

let formulario = document.getElementById("form-cadastro") as HTMLFormElement;
let inputCodigo = document.getElementById("input-codigo") as HTMLInputElement;
let inputDescricao = document.getElementById("input-descricao") as HTMLInputElement;
let inputDetalhamento = document.getElementById("input-detalhamento") as HTMLInputElement;
let botaoSair = document.getElementById("btn-sair") as HTMLButtonElement;
let tabelaTarefas = document.getElementById("tabela-tarefas") as HTMLTableElement;

let btnAtualizar = document.getElementById("btn-atualizar") as HTMLButtonElement;
let novaDescricao = document.getElementById("input-editar-descricao") as HTMLInputElement;
let novoDetalhamento = document.getElementById("input-editar-detalhamento") as HTMLInputElement;

const myModal = new bootstrap.Modal("#exampleModal", {});
const myModalSecond = new bootstrap.Modal("#exampleModal2");

botaoSair.addEventListener("click", sair);

interface Recados {
  codigoID: number;
  descricaoTarefa: string;
  detalhamentoTarefa: string;
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  adicionarNovaTarefa();
});

function adicionarNovaTarefa() {
  /* const toastTrigger = document.getElementById('liveToastBtn') as HTMLButtonElement; */
  const toastLiveExample = document.getElementById("liveToast") as HTMLDivElement;
  let codigo: number = Number(inputCodigo.value);
  let descricaoTarefa: string = inputDescricao.value;
  let detalhamentoTarefa: string = inputDetalhamento.value;

  let recados: Recados = {
    codigoID: codigo,
    descricaoTarefa: descricaoTarefa,
    detalhamentoTarefa: detalhamentoTarefa,
  };

  let listaTarefas: Recados[] = buscarRecadosNoStorage();

  let validarCodigo: boolean = listaTarefas.some(
    (tarefa) => tarefa.codigoID === codigo
  );

  if (validarCodigo) {
    alert("Já existe uma tarefa cadastrada com este código ID");
    inputCodigo.value = "";
    inputCodigo.focus();

    return;
  }

  listaTarefas.push(recados);
  salvarNaTabela(recados);
  formulario.reset();
  salvarNoStorage(listaTarefas);
  myModal.hide();

  const toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
}

function salvarNaTabela(recados: Recados) {
  let novaLinha = document.createElement("tr");
  let colunaCodigo = document.createElement("td");
  let colunaDescricao = document.createElement("td");
  let colunaDetalhamento = document.createElement("td");
  let colunaAcoes = document.createElement("td");
  let botaoApagar = document.createElement("button") as HTMLButtonElement;
  let botaoEditar = document.createElement("button") as HTMLButtonElement;

  novaLinha.setAttribute("class", "registros my-3");
  novaLinha.setAttribute("id", `${recados.codigoID}`);
  colunaCodigo.setAttribute("class", "text-center");
  colunaDescricao.setAttribute("class", "text-center");
  colunaDetalhamento.setAttribute("class", "text-center");
  colunaAcoes.setAttribute("class", " btn-align text-center");
  botaoEditar.setAttribute("type", "button");
  botaoEditar.setAttribute("class", "btn btn-success botao-editar me-2");
  botaoEditar.setAttribute('data-bs-toggle', 'modal');
  botaoEditar.setAttribute('data-bs-target', '#exampleModal2')
  botaoEditar.addEventListener("click", () => {
    editarRecado(recados);
  });

  botaoApagar.setAttribute("class", "btn btn-danger botao-apagar me-2");
  botaoApagar.setAttribute("type", "button");
  botaoApagar.addEventListener("click", () => {
    apagarTarefa(recados.codigoID);
  });

  colunaCodigo.innerHTML = `${recados.codigoID}`;
  colunaDescricao.innerHTML = `${recados.descricaoTarefa}`;
  colunaDetalhamento.innerHTML = `${recados.detalhamentoTarefa}`;
  botaoEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
    </svg>
                            `;
  botaoApagar.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18"
                                    fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                </svg>
                            `;
  colunaAcoes.appendChild(botaoEditar);
  colunaAcoes.appendChild(botaoApagar);
  /* containerButtons.appendChild(colunaAcoes); */
  novaLinha.appendChild(colunaCodigo);
  novaLinha.appendChild(colunaDescricao);
  novaLinha.appendChild(colunaDetalhamento);
  novaLinha.appendChild(colunaAcoes);
  /* novaLinha.appendChild(containerButtons); */

  tabelaTarefas.appendChild(novaLinha);
}

function salvarNoStorage(listaRecados: Recados[]) {
  let listaUsuarios: Usuario[] = JSON.parse(localStorage.getItem("usuarios")!);

  let indiceUsuario: number = listaUsuarios.findIndex((usuario) => {
    return usuario.login === usuarioLogado;
  })!;

  listaUsuarios[indiceUsuario].recados = listaRecados;

  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}

function pegarDadosUsuario() {
  let dadosStorage: Recados[] = buscarRecadosNoStorage();

  if (dadosStorage) {
    for (let item of dadosStorage) {
      salvarNaTabela(item);
    }
  }
  return;
}

function apagarTarefa(codigoID: number) {
  let listaRegistros: Recados[] = buscarRecadosNoStorage();
  let indiceEncontrado = listaRegistros.findIndex(
    (tarefa) => tarefa.codigoID == codigoID
  );

  let confirma: boolean = window.confirm(
    `Tem certeza que deseja remover a tarefa de código #${codigoID}?`
  );

  if (confirma) {
    let linhasTabela = document.querySelectorAll(".registros");

    for (let linha of linhasTabela) {
      if (Number(linha.id) == codigoID) {
        tabelaTarefas.removeChild(linha);
        listaRegistros.splice(indiceEncontrado, 1);
        alert("Registro removido.");
      }
    }

    salvarNoStorage(listaRegistros);
  } else {
    return;
  }
}

function editarRecado(recados: Recados) {
  btnAtualizar.setAttribute("onclick", `atualizarRecado(${recados.codigoID})`);
  novaDescricao.value = recados.descricaoTarefa;
  novoDetalhamento.value = recados.detalhamentoTarefa;
}

function atualizarRecado(codigo: number) {
  
  const toastAlterar = document.getElementById("liveToastTwo") as HTMLDivElement;
  
  let tarefaAtualizada: Recados = {
    codigoID: codigo,
    descricaoTarefa: novaDescricao.value,
    detalhamentoTarefa: novoDetalhamento.value,
  };

  let listaRecados = buscarRecadosNoStorage();
  let indiceRecado = listaRecados.findIndex((tarefa) => tarefa.codigoID == codigo);

  listaRecados[indiceRecado] = tarefaAtualizada;

  let linhasTabela = document.querySelectorAll(".registros") as NodeListOf<HTMLDivElement>;

  for (let item of linhasTabela) {
    if (Number(item.id) === codigo) {
      let colunaCodigo = item.children[0] as HTMLTableCellElement;
      let colunaDescricao = item.children[1] as HTMLTableCellElement;
      let colunaDetalhamento = item.children[2] as HTMLTableCellElement;

      colunaCodigo.innerHTML = `${codigo}`;
      colunaDescricao.innerHTML = tarefaAtualizada.descricaoTarefa;
      colunaDetalhamento.innerHTML = tarefaAtualizada.detalhamentoTarefa;
    }
  }
  salvarNoStorage(listaRecados);
  myModalSecond.hide();

  const toast = new bootstrap.Toast(toastAlterar);
  toast.show();

}

function buscarRecadosNoStorage(): Recados[] {
  let listaUsuarios: Usuario[] = JSON.parse(
    window.localStorage.getItem("usuarios")!
  );

  let dadosUsuarioLogado: Usuario = listaUsuarios.find((usuario) => {
    return usuario.login === usuarioLogado;
  })!;

  return dadosUsuarioLogado.recados;
}

function sair(): void {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "../index.html";
}
