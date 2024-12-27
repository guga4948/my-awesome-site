document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const validUsername = btoa("gustavo");
  const validPassword = btoa("bola#2000");

  if (btoa(username) === validUsername && btoa(password) === validPassword) {
    window.location.href = "FrontEnd.html";
  } else {
    document.getElementById("error-message").textContent = 
      "Utilizador ou senha incorretos.";
  }
});
