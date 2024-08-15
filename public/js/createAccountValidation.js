document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createAccountForm");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", function (event) {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

    if (!usernameRegex.test(username)) {
      errorMessage.textContent = "Username must contain only letters and digits.";
      event.preventDefault();
      return;
    }

    if (!passwordRegex.test(password)) {
      errorMessage.textContent = "Password must be at least 4 characters long and contain at least one letter and one digit.";
      event.preventDefault();
      return;
    }

    errorMessage.textContent = "";
  });
});
