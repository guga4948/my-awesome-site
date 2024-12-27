const userForm = document.getElementById("user-form");
const userTableBody = document.querySelector("#user-list tbody");
let editingIndex = null; // Índice do utilizador sendo editado (se houver)

function loadUsers() {
  // Obtemos a chave de usuários e descomprimimos se houver dados
  const usersCompressed = localStorage.getItem("users");
  let users = [];

  if (usersCompressed) {
    const decompressed = LZString.decompress(usersCompressed);
    if (decompressed) {
      users = JSON.parse(decompressed);
    }
  }

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
    const usersCompressed = localStorage.getItem("users");
    let users = [];

    if (usersCompressed) {
      const decompressed = LZString.decompress(usersCompressed);
      if (decompressed) {
        users = JSON.parse(decompressed);
      }
    }

    if (editingIndex !== null) {
      // Atualiza utilizador existente
      users[editingIndex] = newUser;
      editingIndex = null;
      alert("Utilizador atualizado com sucesso!");

      document.querySelector('button[type="submit"]').textContent = "Adicionar";
    } else {
      // Adiciona novo utilizador
      users.push(newUser);
      alert("Utilizador adicionado com sucesso!");
    }

    // Comprime antes de salvar no localStorage
    const compressed = LZString.compress(JSON.stringify(users));
    localStorage.setItem("users", compressed);
    userForm.reset();
    loadUsers();
  };

  reader.readAsDataURL(photoInput);
});

function editUser(index) {
  const usersCompressed = localStorage.getItem("users");
  let users = [];

  if (usersCompressed) {
    const decompressed = LZString.decompress(usersCompressed);
    if (decompressed) {
      users = JSON.parse(decompressed);
    }
  }

  const user = users[index];

  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("dob").value = user.dob;
  document.getElementById("phone").value = user.phone;
  document.getElementById("email").value = user.email;
  document.getElementById("age").value = user.age;
  document.getElementById("instagram").value = user.instagram;

  editingIndex = index;

  document.querySelector('button[type="submit"]').textContent = "Salvar Alterações";
}

// Inicializa a lista de utilizadores
loadUsers();
