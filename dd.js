function toggleDropdown() {
  const dropdown = document.querySelector(".dd");
  dropdown.classList.toggle("dd--open");
}

function selectOption(language) {
  // Replace current language with choosen language
  const title = document.getElementById("ddTitle");
  title.textContent = language;

  // Select current language in the list
  document.querySelectorAll(".dd__item").forEach((item) => {
    item.classList.remove("selected");
    if (item.textContent === language) {
      item.classList.add("selected");
    }
  });

  // Close dropdown
  toggleDropdown();
}
