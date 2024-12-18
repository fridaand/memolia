// LOAD & SHOW DICTIONARIES FOR A CATEGORY
function loadAndDisplayWordList(category, language) {
  // Get dictionary from JSON-file
  fetch(`./data/${category}.json`)
    .then((response) => response.json())
    .then((data) => {
      const wordList = document.querySelector(
        `[data-dropdown="dd-${category}"] .wrapper-word`
      );
      wordList.innerHTML = ""; // Clean content in list before adding new

      // Sort words A-Ö
      data.sort((a, b) => a.language.swedish.localeCompare(b.language.swedish));

      // Creating <p> for each element i data-list
      data.forEach((wordData) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "list-word";

        const swedishP = document.createElement("p");
        swedishP.className = "swedish";
        swedishP.textContent = wordData.language.swedish;
        wordDiv.appendChild(swedishP);

        const translationP = document.createElement("p");
        translationP.className = "translation";
        translationP.textContent = wordData.language[language]; // Use right language in the dictionary
        wordDiv.appendChild(translationP);

        wordList.appendChild(wordDiv);
      });
    })

    .catch((error) =>
      console.error(
        `Det uppstod ett fel vid hämtning av data för ${category}: ${error}`
      )
    );
}

// LISTEN TO CLICK - DROPDOWN
const dropdownButtons = document.querySelectorAll(".dropdown-button");

dropdownButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const containerCategories = button.closest(".container_categories");
    const categoryWords =
      containerCategories.querySelector(".dd-category_words");
    const arrow = button.querySelector(".arrow");
    const category = categoryWords.getAttribute("data-dropdown").substring(3); // Hämta kategorin från data-attributet
    categoryWords.classList.toggle("open");
    arrow.classList.toggle("rotate");

    // Get current lnguage from localStorage
    const selectedLanguage = localStorage.getItem("language") || "english";

    // Load and display dictionary for current category in current language
    loadAndDisplayWordList(category, selectedLanguage);
  });
});

function updateAllCategories(language) {
  // Go through all categories and reload dictionary
  categories.forEach((category) => {
    loadAndDisplayWordList(category.name, language);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  registerPopup();
  registerCategories();
  loadLanguageData();
  updateRounds();
  updateTotalTime();
  updateStars();
  updateFlag();
});
