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

      function parseSwedishNumber(word) {
        const units = {
          noll: 0,
          ett: 1,
          två: 2,
          tre: 3,
          fyra: 4,
          fem: 5,
          sex: 6,
          sju: 7,
          åtta: 8,
          nio: 9,
        };
        const teens = {
          tio: 10,
          elva: 11,
          tolv: 12,
          tretton: 13,
          fjorton: 14,
          femton: 15,
          sexton: 16,
          sjutton: 17,
          arton: 18,
          nitton: 19,
        };
        const tens = {
          tjugo: 20,
          trettio: 30,
          fyrtio: 40,
          femtio: 50,
          sextio: 60,
          sjuttio: 70,
          åttio: 80,
          nittio: 90,
        };
        const hundreds = {
          hundra: 100,
        };
        const thousands = {
          tusen: 1000,
        };
        const millions = {
          miljon: 1000000,
          "en miljon": 1000000,
        };

        word = word.toLowerCase().trim(); // Standardisera input

        // Om ordet finns direkt i en av tabellerna
        if (units[word] !== undefined) return units[word];
        if (teens[word] !== undefined) return teens[word];
        if (tens[word] !== undefined) return tens[word];
        if (hundreds[word] !== undefined) return hundreds[word];
        if (thousands[word] !== undefined) return thousands[word];
        if (millions[word] !== undefined) return millions[word];

        // Hantera "hundrafemtio", "trehundra", "femtusentvå", "två miljoner"
        let num = 0;
        let parts = word.split(" "); // Dela upp på mellanslag, t.ex. "två miljoner"

        parts.forEach((part) => {
          if (units[part] !== undefined) num += units[part];
          else if (teens[part] !== undefined) num += teens[part];
          else if (tens[part] !== undefined) num += tens[part];
          else if (hundreds[part] !== undefined) num *= 100; // Ex: "tre hundra"
          else if (thousands[part] !== undefined)
            num *= 1000; // Ex: "två tusen"
          else if (millions[part] !== undefined) num *= 1000000; // Ex: "en miljon"
        });

        return num > 0 ? num : null; // Returnera num om något hittades, annars null
      }

      // Anpassad sortering
      data.sort((a, b) => {
        let wordA = a.language.swedish.toLowerCase();
        let wordB = b.language.swedish.toLowerCase();

        let numA = parseSwedishNumber(wordA);
        let numB = parseSwedishNumber(wordB);

        if (numA !== null && numB !== null) {
          return numA - numB; // Sortera numeriskt om båda är siffror
        } else if (numA !== null) {
          return -1; // Om A är en siffra men inte B, placera A före
        } else if (numB !== null) {
          return 1; // Om B är en siffra men inte A, placera B före
        }

        return wordA.localeCompare(wordB, "sv", { sensitivity: "base" }); // Annars alfabetisk sortering
      });

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

        // Event listener för click
        wordDiv.addEventListener("click", (event) => {
          let audioSrc = null;

          if (event.target.classList.contains("swedish")) {
            audioSrc = wordData.audio.swedish;
          } else if (event.target.classList.contains("translation")) {
            audioSrc = wordData.audio[language];
            event.target.classList.add("clicked");

            // Ta bort 'clicked' klass efter en viss tid (300ms, samma som animationens längd)
            setTimeout(() => {
              event.target.classList.remove("clicked");
            }, 1000);
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
