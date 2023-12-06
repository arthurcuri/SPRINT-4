// Função para realizar o cadastro do usuário
function cadastrarUsuario() {
  // Obtenha os dados do formulário de cadastro
  const newUsername = document.getElementById('newUsername').value;
  const newEmail = document.getElementById('newEmail').value;
  const newPassword = document.getElementById('newPassword').value;

  // Validações básicas (adapte conforme necessário)
  if (!validarCadastro(newUsername, newEmail, newPassword)) {
    return;
  }

  // Verifique se o usuário já existe no localStorage
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifique se o usuário já existe
  if (usuarios.find(usuario => usuario.username === newUsername)) {
    alert('Usuário já cadastrado. Escolha outro nome de usuário.');
    return;
  }

  // Adicione o novo usuário à lista
  const novoUsuario = {
    username: newUsername,
    email: newEmail,
    password: newPassword
  };
  usuarios.push(novoUsuario);

  // Atualize a lista de usuários no localStorage
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  // Redirecione para a página de login
  window.location.href = 'login.html';
}

// Função para validar os dados do formulário de cadastro
function validarCadastro(username, email, password) {
  if (username.length < 3 || email === "" || password.length < 6) {
    alert('Por favor, preencha todos os campos corretamente.');
    return false;
  }
  return true;
}
