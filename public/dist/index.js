"use strict";
let btnAcessar = document.getElementById("btn-acessar");
let btnCadastrar = document.getElementById("btn-cadastrar");
let container = document.getElementById("container");
btnAcessar.addEventListener("click", () => {
    container.classList.remove("painel-direita-ativo");
});
btnCadastrar.addEventListener("click", () => {
    container.classList.add("painel-direita-ativo");
});
/* CADASTRO DE UM USUÁRIO */
let formularioCadastro = document.querySelector("#formulario-cadastro");
let inputCadastroNome = document.querySelector("#input-cadastro-nome");
let inputCadastroEmail = document.querySelector("#input-cadastro-email");
let inputCadastroSenha = document.querySelector("#input-cadastro-senha");
formularioCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    verificaCamposCadastro();
});
function verificaCamposCadastro() {
    if (inputCadastroNome.value === "" || inputCadastroNome.value.length < 3) {
        inputCadastroNome.focus();
        inputCadastroNome.setAttribute("style", "outline-color: red");
        return;
    }
    if (inputCadastroEmail.value === "" || inputCadastroEmail.value.length < 10) {
        inputCadastroEmail.focus();
        inputCadastroEmail.setAttribute("style", "outline-color: red");
        return;
    }
    if (inputCadastroSenha.value === "" || inputCadastroSenha.value.length < 7) {
        inputCadastroSenha.focus();
        inputCadastroSenha.setAttribute("style", "outline-color: red");
        return;
    }
    inputCadastroNome.removeAttribute("style");
    inputCadastroEmail.removeAttribute("style");
    inputCadastroSenha.removeAttribute("style");
    let novoUsuario = {
        nome: inputCadastroNome.value,
        login: inputCadastroEmail.value,
        senha: inputCadastroSenha.value,
        recados: [],
    };
    cadastrarUsuario(novoUsuario);
}
function cadastrarUsuario(novoUsuario) {
    let listaUsuarios /* ou Array<Usuario> */ = buscarUsuariosNoStorage();
    let existe = listaUsuarios.some((usuario) => {
        return usuario.login === novoUsuario.login;
    });
    if (existe) {
        let confirma = confirm("Este email já está cadastrado. Deseja ir para a página de login?");
        if (confirma) {
            container.classList.remove("painel-direita-ativo");
            formularioCadastro.reset();
        }
        return;
    }
    listaUsuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    alert("Conta criada com sucesso!");
    formularioCadastro.reset();
    setTimeout(() => {
        container.classList.remove("painel-direita-ativo");
    }, 1000);
}
function buscarUsuariosNoStorage() {
    return JSON.parse(localStorage.getItem("usuarios") || "[]");
}
/* LOGAR O USUÁRIO NA APLICAÇÃO - Login */
let formularioLogin = document.querySelector("#formulario-login");
let inputLoginEmail = document.querySelector("#input-login-email");
let inputLoginSenha = document.querySelector("#input-login-senha");
formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    validarCamposLogin();
});
function validarCamposLogin() {
    if (inputLoginEmail.value === "") {
        inputCadastroSenha.focus();
        inputCadastroSenha.setAttribute("style", "outline-color: red");
        return;
    }
    if (inputLoginSenha.value === "") {
        inputCadastroSenha.focus();
        inputCadastroSenha.setAttribute("style", "outline-color: red");
        return;
    }
    inputLoginEmail.removeAttribute("style");
    inputLoginSenha.removeAttribute("style");
    let usuarioLogando = {
        login: inputLoginEmail.value,
        senha: inputLoginSenha.value,
    };
    logarNoSistema(usuarioLogando);
}
function logarNoSistema(usuarioLogando) {
    let listaUsuarios = buscarUsuariosNoStorage();
    let existe = listaUsuarios.some((usuario) => {
        return (usuario.login === usuarioLogando.login &&
            usuario.senha === usuarioLogando.senha);
    });
    if (!existe) {
        alert("Email ou senha incorretos!");
        return;
    }
    localStorage.setItem("usuarioLogado", inputLoginEmail.value);
    window.location.href = "public/home.html";
}
