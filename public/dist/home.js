"use strict";
document.addEventListener("DOMContentLoaded", () => {
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar esta página!");
        window.location.href = "index.html";
        return;
    }
    pegarDadosUsuario();
});
let usuarioLogado = localStorage.getItem("usuarioLogado");
let formulario = document.getElementById("form-cadastro");
let inputCodigo = document.getElementById("input-codigo");
let inputDescricao = document.getElementById("input-descricao");
let inputDetalhamento = document.getElementById("input-detalhamento");
let botaoSair = document.getElementById("btn-sair");
let tabelaTarefas = document.getElementById("tabela-tarefas");
let btnAtualizar = document.getElementById("btn-atualizar");
let novaDescricao = document.getElementById("input-editar-descricao");
let novoDetalhamento = document.getElementById("input-editar-detalhamento");
const myModal = new bootstrap.Modal("#exampleModal", {});
const myModalSecond = new bootstrap.Modal("#exampleModal2");
botaoSair.addEventListener("click", sair);
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    adicionarNovaTarefa();
});
function adicionarNovaTarefa() {
    /* const toastTrigger = document.getElementById('liveToastBtn') as HTMLButtonElement; */
    const toastLiveExample = document.getElementById("liveToast");
    let codigo = Number(inputCodigo.value);
    let descricaoTarefa = inputDescricao.value;
    let detalhamentoTarefa = inputDetalhamento.value;
    let recados = {
        codigoID: codigo,
        descricaoTarefa: descricaoTarefa,
        detalhamentoTarefa: detalhamentoTarefa,
    };
    let listaTarefas = buscarRecadosNoStorage();
    let validarCodigo = listaTarefas.some((tarefa) => tarefa.codigoID === codigo);
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
function salvarNaTabela(recados) {
    let novaLinha = document.createElement("tr");
    let colunaCodigo = document.createElement("td");
    let colunaDescricao = document.createElement("td");
    let colunaDetalhamento = document.createElement("td");
    let colunaAcoes = document.createElement("td");
    let botaoApagar = document.createElement("button");
    let botaoEditar = document.createElement("button");
    novaLinha.setAttribute("class", "registros my-3");
    novaLinha.setAttribute("id", `${recados.codigoID}`);
    colunaCodigo.setAttribute("class", "text-center");
    colunaDescricao.setAttribute("class", "text-center");
    colunaDetalhamento.setAttribute("class", "text-center");
    colunaAcoes.setAttribute("class", " btn-align text-center");
    botaoEditar.setAttribute("type", "button");
    botaoEditar.setAttribute("class", "btn btn-success botao-editar me-2");
    botaoEditar.setAttribute('data-bs-toggle', 'modal');
    botaoEditar.setAttribute('data-bs-target', '#exampleModal2');
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
function salvarNoStorage(listaRecados) {
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let indiceUsuario = listaUsuarios.findIndex((usuario) => {
        return usuario.login === usuarioLogado;
    });
    listaUsuarios[indiceUsuario].recados = listaRecados;
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}
function pegarDadosUsuario() {
    let dadosStorage = buscarRecadosNoStorage();
    if (dadosStorage) {
        for (let item of dadosStorage) {
            salvarNaTabela(item);
        }
    }
    return;
}
function apagarTarefa(codigoID) {
    let listaRegistros = buscarRecadosNoStorage();
    let indiceEncontrado = listaRegistros.findIndex((tarefa) => tarefa.codigoID == codigoID);
    let confirma = window.confirm(`Tem certeza que deseja remover a tarefa de código #${codigoID}?`);
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
    }
    else {
        return;
    }
}
function editarRecado(recados) {
    btnAtualizar.setAttribute("onclick", `atualizarRecado(${recados.codigoID})`);
    novaDescricao.value = recados.descricaoTarefa;
    novoDetalhamento.value = recados.detalhamentoTarefa;
}
function atualizarRecado(codigo) {
    const toastAlterar = document.getElementById("liveToastTwo");
    let tarefaAtualizada = {
        codigoID: codigo,
        descricaoTarefa: novaDescricao.value,
        detalhamentoTarefa: novoDetalhamento.value,
    };
    let listaRecados = buscarRecadosNoStorage();
    let indiceRecado = listaRecados.findIndex((tarefa) => tarefa.codigoID == codigo);
    listaRecados[indiceRecado] = tarefaAtualizada;
    let linhasTabela = document.querySelectorAll(".registros");
    for (let item of linhasTabela) {
        if (Number(item.id) === codigo) {
            let colunaCodigo = item.children[0];
            let colunaDescricao = item.children[1];
            let colunaDetalhamento = item.children[2];
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
function buscarRecadosNoStorage() {
    let listaUsuarios = JSON.parse(window.localStorage.getItem("usuarios"));
    let dadosUsuarioLogado = listaUsuarios.find((usuario) => {
        return usuario.login === usuarioLogado;
    });
    return dadosUsuarioLogado.recados;
}
function sair() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../index.html";
}
