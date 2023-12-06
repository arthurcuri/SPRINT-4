// Função para realizar o login do usuário
function login() {
  // Obtenha os dados do formulário de login
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Verifique se o usuário existe no localStorage
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Encontre o usuário correspondente
  const usuario = usuarios.find(u => u.username === username);

  // Verifique se o usuário existe e a senha está correta
  if (usuario && usuario.password === password) {
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    window.location.href = 'index.html';
  } else {
    alert('Nome de usuário ou senha incorretos. Tente novamente.');
  }
}
