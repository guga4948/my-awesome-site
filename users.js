const userForm = document.getElementById("user-form");
const userList = document.getElementById("user-list");
let editingIndex = null; // Índice do utilizador em edição

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  userList.innerHTML = users
    .map(
      (user, index) => `
      <div class="user-card">
        <img src="${user.photo}" alt="${user.firstName}" width="50">
        <p><strong>${user.firstName} ${user.lastName}</strong> (${user.age} anos)</p>
        <p>Data de Nascimento: ${user.dob}</p>
        <p>Telefone: ${user.phone}</p>
        <p>E-mail: ${user.email}</p>
        <p>Instagram: <a href="https://instagram.com/${user.instagram}" target="_blank">@${user.instagram}</a></p>
        <button onclick="editUser(${index})">Editar</button>
        <button onclick="deleteUser(${index})">Eliminar</button>
      </div>
    `
    )
    .join("");
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const dob = document.getElementById("dob").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const instagram = document.getElementById("instagram").value;
  const photoInput = document.getElementById("photo").files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const photo = reader.result;

    const newUser = { firstName, lastName, dob, phone, email, age, instagram, photo };
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (editingIndex !== null) {
      // Atualiza o utilizador existente
      users[editingIndex] = newUser;
      editingIndex = null; // Limpa o índice de edição
      alert("Utilizador atualizado com sucesso!");

      // Altera o texto do botão para "Adicionar"
      document.querySelector('button[type="submit"]').textContent = "Adicionar";
    } else {
      // Adiciona um novo utilizador
      users.push(newUser);
      alert("Utilizador adicionado com sucesso!");
    }

    localStorage.setItem("users", JSON.stringify(users));
    userForm.reset();
    loadUsers();
  };

  reader.readAsDataURL(photoInput);
});

function editUser(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users[index];

  // Preenche o formulário com os dados existentes
  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("dob").value = user.dob;
  document.getElementById("phone").value = user.phone;
  document.getElementById("email").value = user.email;
  document.getElementById("age").value = user.age;
  document.getElementById("instagram").value = user.instagram;

  editingIndex = index; // Define o índice que está sendo editado

  // Atualiza o botão para indicar modo de edição
  document.querySelector('button[type="submit"]').textContent = "Salvar Alterações";
}

function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1); // Remove o utilizador do array

  localStorage.setItem("users", JSON.stringify(users));
  alert("Utilizador eliminado com sucesso!");
  loadUsers(); // Atualiza a lista de utilizadores
}

// Inicializa a lista de utilizadores
loadUsers();
