const userForm = document.getElementById("user-form");
const userList = document.getElementById("user-list");

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  userList.innerHTML = users
    .map(
      (user) => `
      <div>
        <img src="${user.photo}" alt="${user.firstName}" width="50">
        <p>${user.firstName} ${user.lastName} (${user.age} anos)</p>
        <p><a href="https://instagram.com/${user.instagram}" target="_blank">@${user.instagram}</a></p>
      </div>
    `
    )
    .join("");
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const age = document.getElementById("age").value;
  const instagram = document.getElementById("instagram").value;
  const photoInput = document.getElementById("photo").files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const photo = reader.result;

    const newUser = { firstName, lastName, age, instagram, photo };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    alert("Utilizador adicionado com sucesso!");
    userForm.reset();
    loadUsers();
  };

  reader.readAsDataURL(photoInput);
});

loadUsers();
