// Loopa igenom varje kategori och lägg till klickhändelselyssnare
categories.forEach((category) => {
  const missionElement = document.getElementById(category.id);

  missionElement.addEventListener("click", () => {
    // Spara den valda kategorin i localStorage
    localStorage.setItem("selectedCategory", category.name);
    localStorage.setItem(
      "categoryTitle",
      document.getElementById("cate-" + category.name).innerText
    );
  });
});
