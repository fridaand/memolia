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

      // Creating DOM-element (<p>) for each element i data-list
      data.forEach((wordData) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "list-word";

        wordDiv.dataset.audioSwedish = wordData.audio.swedish || "";
        wordDiv.dataset.audioTranslation = wordData.audio[language] || "";

        const swedishP = document.createElement("p");
        const swedishSpan = document.createElement("span");

        swedishSpan.textContent = wordData.language.swedish;
        swedishSpan.classList.add("swedish");
        swedishP.appendChild(swedishSpan);
        wordDiv.appendChild(swedishP);

        const translationP = document.createElement("p");
        const translationSpan = document.createElement("span");

        translationSpan.textContent = wordData.language[language];
        translationSpan.classList.add("translation");
        translationP.appendChild(translationSpan);
        wordDiv.appendChild(translationP);

        // Click event for words in dictionary list
        let isAudioPlaying = false;

        // Function for playing audio for words
        function playAudio(audioSrc) {
          if (isAudioPlaying || !audioSrc) return;

          const audio = new Audio(audioSrc);
          isAudioPlaying = true;

          audio.play().catch((error) => {
            console.warn("Ljudet kunde inte spelas:", error);
          });

          audio.onended = () => {
            isAudioPlaying = false;
          };
        }

        // Event listener för mouseover
        wordDiv.addEventListener("mouseover", (event) => {
          let audioSrc = null;

          if (event.target.classList.contains("swedish")) {
            audioSrc = wordData.audio.swedish;
          } else if (event.target.classList.contains("translation")) {
            audioSrc = wordData.audio[language];
          }

          playAudio(audioSrc);
        });

        // Event listener för click
        wordDiv.addEventListener("click", (event) => {
          let audioSrc = null;

          if (event.target.classList.contains("swedish")) {
            audioSrc = wordData.audio.swedish;
          } else if (event.target.classList.contains("translation")) {
            audioSrc = wordData.audio[language];
          }

          playAudio(audioSrc);
        });

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
const dropdownButtons = document.querySelectorAll(".wrapper_category");

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
