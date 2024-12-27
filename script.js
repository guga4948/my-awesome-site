document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Hash simples para verificação (melhor seria usar um servidor)
  const validUsername = btoa('gustavo'); // Base64 encode
  const validPassword = btoa('bola#2000');

  if (btoa(username) === validUsername && btoa(password) === validPassword) {
    alert('Login bem-sucedido!');
    // Redirecionar ou abrir outra página aqui
  } else {
    document.getElementById('error-message').textContent =
      'Utilizador ou senha incorretos.';
  }
});
