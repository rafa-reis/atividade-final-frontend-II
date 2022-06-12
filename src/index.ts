let btnAcessar = document.getElementById("btn-acessar") as HTMLButtonElement;
let btnCadastrar = document.getElementById(
  "btn-cadastrar"
) as HTMLButtonElement;
let container = document.getElementById("container") as HTMLDivElement;

btnAcessar.addEventListener("click", () => {
  container.classList.remove("painel-direita-ativo");
});

btnCadastrar.addEventListener("click", () => {
  container.classList.add("painel-direita-ativo");
});

/* CADASTRO DE UM USUÁRIO */

let formularioCadastro = document.querySelector(
  "#formulario-cadastro"
) as HTMLFormElement;
let inputCadastroNome = document.querySelector(
  "#input-cadastro-nome"
) as HTMLInputElement;
let inputCadastroEmail = document.querySelector(
  "#input-cadastro-email"
) as HTMLInputElement;
let inputCadastroSenha = document.querySelector(
  "#input-cadastro-senha"
) as HTMLInputElement;

interface Usuario {
  nome: string;
  login: string;
  senha: string;
  recados: any[];
}

formularioCadastro.addEventListener("submit", (e) => {
  e.preventDefault();

  verificaCamposCadastro();
});

function verificaCamposCadastro(): void {
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

  let novoUsuario: Usuario = {
    nome: inputCadastroNome.value,
    login: inputCadastroEmail.value,
    senha: inputCadastroSenha.value,
    recados: [],
  };

  cadastrarUsuario(novoUsuario);
}

function cadastrarUsuario(novoUsuario: Usuario) {
  let listaUsuarios: Usuario[] /* ou Array<Usuario> */ =
    buscarUsuariosNoStorage();

  let existe: boolean = listaUsuarios.some((usuario) => {
    return usuario.login === novoUsuario.login;
  });

  if (existe) {
    let confirma = confirm(
      "Este email já está cadastrado. Deseja ir para a página de login?"
    );

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

function buscarUsuariosNoStorage(): Usuario[] {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}

/* LOGAR O USUÁRIO NA APLICAÇÃO - Login */

let formularioLogin = document.querySelector(
  "#formulario-login"
) as HTMLFormElement;
let inputLoginEmail = document.querySelector(
  "#input-login-email"
) as HTMLInputElement;
let inputLoginSenha = document.querySelector(
  "#input-login-senha"
) as HTMLInputElement;

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

function logarNoSistema(usuarioLogando: any) {
  let listaUsuarios: Usuario[] = buscarUsuariosNoStorage();

  let existe: boolean = listaUsuarios.some((usuario) => {
    return (
      usuario.login === usuarioLogando.login &&
      usuario.senha === usuarioLogando.senha
    );
  });

  if (!existe) {
    alert("Email ou senha incorretos!");
    return;
  }

  localStorage.setItem("usuarioLogado", inputLoginEmail.value);

  window.location.href = "public/home.html";
}
