const userForm = document.getElementById("user-form");
const userTableBody = document.querySelector("#user-list tbody");
let editingIndex = null; // Índice para rastrear o usuário em edição

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  userTableBody.innerHTML = users
    .map(
      (user, index) => `
      <tr>
        <td><img src="${user.photo}" alt="${user.firstName}" width="50"></td>
        <td>${user.firstName} ${user.lastName}</td>
        <td><a href="https://instagram.com/${user.instagram}" target="_blank">@${user.instagram}</a></td>
        <td><button onclick="editUser(${index})">Editar</button></td>
      </tr>
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
    } else {
      // Adiciona um novo utilizador
      users.push(newUser);
      alert("Utilizador adicionado com sucesso!");
    }

    localStorage.setItem("users", JSON.stringify(users));
    userForm.reset();
    loadUsers(); // Recarrega a tabela de utilizadores
    document.querySelector('button[type="submit"]').textContent = "Adicionar";
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
  document.querySelector('button[type="submit"]').textContent = "Salvar Alterações";
}

// Inicializa a tabela de utilizadores
loadUsers();
