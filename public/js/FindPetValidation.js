document.addEventListener("DOMContentLoaded", function () {
  const findDogForm = document.getElementById("findDogForm");
  const findCatForm = document.getElementById("findCatForm");

  findDogForm.addEventListener("submit", function (event) {
    const dogBreedChecked = document.querySelectorAll('input[name="dogbreed"]:checked').length > 0;
    const dogAge = document.getElementById("dogage").value;
    const dogGenderChecked = document.querySelector('input[name="doggender"]:checked') !== null;
    const dogGetAlongDogsChecked = document.querySelectorAll('input[name="doggetalongdogs"]:checked').length > 0;
    const dogGetAlongCatsChecked = document.querySelectorAll('input[name="doggetalongcats"]:checked').length > 0;
    const dogGetAlongChildrenChecked = document.querySelectorAll('input[name="doggetalongchildren"]:checked').length > 0;

    if (!dogBreedChecked || !dogAge || !dogGenderChecked || !dogGetAlongDogsChecked || !dogGetAlongCatsChecked || !dogGetAlongChildrenChecked) {
      event.preventDefault();
      document.getElementById("error-message-dog").textContent = "Please fill out all fields in the Dog section.";
    } else {
      document.getElementById("error-message-dog").textContent = "";
    }
  });

  findCatForm.addEventListener("submit", function (event) {
    const catBreedChecked = document.querySelectorAll('input[name="catbreed"]:checked').length > 0;
    const catAge = document.getElementById("agecat").value;
    const catGenderChecked = document.querySelector('input[name="catgender"]:checked') !== null;
    const catGetAlongDogsChecked = document.querySelectorAll('input[name="catgetalongdogs"]:checked').length > 0;
    const catGetAlongCatsChecked = document.querySelectorAll('input[name="catgetalongcats"]:checked').length > 0;
    const catGetAlongChildrenChecked = document.querySelectorAll('input[name="catgetalongchildren"]:checked').length > 0;

    if (!catBreedChecked || !catAge || !catGenderChecked || !catGetAlongDogsChecked || !catGetAlongCatsChecked || !catGetAlongChildrenChecked) {
      event.preventDefault();
      document.getElementById("error-message-cat").textContent = "Please fill out all fields in the Cat section.";
    } else {
      document.getElementById("error-message-cat").textContent = "";
    }
  });
});


