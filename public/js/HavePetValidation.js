document.addEventListener("DOMContentLoaded", function () {
  const giveAwayDogForm = document.getElementById("giveAwayDogForm");
  const giveAwayCatForm = document.getElementById("giveAwayCatForm");

  giveAwayDogForm.addEventListener("submit", function (event) {
    const breedChecked = document.querySelectorAll('input[name="breed-dog[]"]:checked').length > 0;
    const animalAge = document.getElementById("animalage-dog").value;
    const genderChecked = document.querySelector('input[name="gender-dog"]:checked') !== null;
    const getAlongDogsChecked = document.querySelector('input[name="getalong-dog"]:checked') !== null;
    const getAlongCatsChecked = document.querySelector('input[name="getalong-cats"]:checked') !== null;
    const getAlongChildrenChecked = document.querySelector('input[name="getalong-children"]:checked') !== null;
    const firstName = document.getElementById("firstname-dog").value.trim();
    const lastName = document.getElementById("lastname-dog").value.trim();
    const email = document.getElementById("email-dog").value.trim();

    if (!breedChecked || !animalAge || !genderChecked || !getAlongDogsChecked || !getAlongCatsChecked || !getAlongChildrenChecked || !firstName || !lastName || !email) {
      event.preventDefault();
      document.getElementById("error-message-giveaway-dog").textContent = "Please fill out all fields in the Dog section.";
    } else if (!validateEmail(email)) {
      event.preventDefault();
      document.getElementById("error-message-giveaway-dog").textContent = "Please provide a valid email address.";
    } else {
      document.getElementById("error-message-giveaway-dog").textContent = "";
    }
  });

  giveAwayCatForm.addEventListener("submit", function (event) {
    const breedChecked = document.querySelectorAll('input[name="breed-cat[]"]:checked').length > 0;
    const animalAge = document.getElementById("animalage-cat").value;
    const genderChecked = document.querySelector('input[name="gender-cat"]:checked') !== null;
    const getAlongDogsChecked = document.querySelector('input[name="getalong-dogs-cat"]:checked') !== null;
    const getAlongCatsChecked = document.querySelector('input[name="getalong-cats-cat"]:checked') !== null;
    const getAlongChildrenChecked = document.querySelector('input[name="getalong-children-cat"]:checked') !== null;
    const firstName = document.getElementById("firstname-cat").value.trim();
    const lastName = document.getElementById("lastname-cat").value.trim();
    const email = document.getElementById("email-cat").value.trim();

    if (!breedChecked || !animalAge || !genderChecked || !getAlongDogsChecked || !getAlongCatsChecked || !getAlongChildrenChecked || !firstName || !lastName || !email) {
      event.preventDefault();
      document.getElementById("error-message-giveaway-cat").textContent = "Please fill out all fields in the Cat section.";
    } else if (!validateEmail(email)) {
      event.preventDefault();
      document.getElementById("error-message-giveaway-cat").textContent = "Please provide a valid email address.";
    } else {
      document.getElementById("error-message-giveaway-cat").textContent = "";
    }
  });

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
});
