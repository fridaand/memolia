// Shared JS

/* VARIABLES */
const scrollButton = document.getElementById("scroll-button");
const scrollArea = document.getElementById("scroll-area");
const cursor = document.createElement("div");
const maxNumberOfStartsPerCategory = 5;
let customCursor = document.querySelector("#custom-cursor");

// ARRAY WITH CATEGORIES
const categories = [
  { id: "fruits-game_mini", name: "fruits_mini" },
  { id: "hello-game_1", name: "hello_1" },
  { id: "people-game_1", name: "people_1" },
  { id: "drinks-game_1", name: "drinks_1" },
  { id: "fruits-game_1", name: "fruits_1" },
  { id: "colours-game_1", name: "colours_1" },
  { id: "verbs-game_1", name: "verbs_1" },
  { id: "dishes-game_1", name: "dishes_1" },
  { id: "vegetables-game_1", name: "vegetables_1" },
  { id: "animals-game_1", name: "animals_1" },
  { id: "numbers-game_1", name: "numbers_1" },
  { id: "activities-game_1", name: "activities_1" },
  { id: "nature-game_1", name: "nature_1" },
  { id: "travel-game_1", name: "travel_1" },
  { id: "numbers-game_2", name: "numbers_2" },
  { id: "herbs-game_1", name: "herbs_1" },
  { id: "adjectives-game_1", name: "adjectives_1" },
  { id: "travel-game_2", name: "travel_2" },
  { id: "place_store-game_1", name: "place_store_1" },
  { id: "fruits-game_2", name: "fruits_2" },
  { id: "place_restaurant-game_1", name: "place_restaurant_1" },
  /*   { id: "numbers-game_3", name: "numbers_3" },
   */
];

/* HIDE CURSOR FOR IPAD ETC */
document.addEventListener("DOMContentLoaded", () => {
  const isTouchDevice =
    matchMedia("(hover: none) and (pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.querySelector("#custom-cursor").style.display = "none";
    document.documentElement.style.cursor = "auto"; // Reset cursor
  }
});

function updateCursorVisibility(event) {
  if (event.pointerType === "touch") {
    customCursor.style.display = "none";
    document.documentElement.style.cursor = "auto";
  } else {
    customCursor.style.display = "block";
    document.documentElement.style.cursor = "none";
  }
}

window.addEventListener("pointermove", updateCursorVisibility);

/* TEXT ANIMATION */
document.addEventListener("DOMContentLoaded", function () {
  const typingElements = document.querySelectorAll(".typing-text");

  typingElements.forEach((element) => {
    const fullText = element.textContent; // Hämtar texten direkt från elementet
    element.textContent = ""; // Tömmer innehållet tillfälligt
    let index = 0;

    function type() {
      if (index < fullText.length) {
        element.textContent += fullText[index];
        index++;
        setTimeout(type, 25); // Hastighet i ms
      }
    }

    type();
  });
});

/* TEXT ANIMATION ON PATH */

document.addEventListener("DOMContentLoaded", () => {
  const textPath = document.querySelector(".animated-text");
  const sectionText = document.querySelector(
    ".section_text, .container_text-animation",
  );

  let progress = -50; // Starta från början
  let isPaused = false; // Flagga för att hantera pauser

  function animateText() {
    if (!isPaused) {
      progress += 0.25; // Justera hastigheten genom att ändra detta värde
      if (progress > 100) {
        progress = -100; // Återställ till början utan paus
      }
      textPath.setAttribute("startOffset", `${progress}%`);
    }
    requestAnimationFrame(animateText);
  }

  animateText();

  // Stanna animationen när musen är över scroll-området
  sectionText.addEventListener("click", () => {
    isPaused = !isPaused;
  });
});

/* POPUP & BUTTON - CLEAR */
document.addEventListener("DOMContentLoaded", () => {
  const clearButton = document.getElementById("clear-button");
  const clearDialog = document.getElementById("clear-dialog");
  const confirmClear = document.getElementById("confirm-clear");
  const cancelClear = document.getElementById("cancel-clear");
  const closeButton = document.querySelector(".button_close");

  // Funktion för att visa dialogrutan
  function showDialog() {
    clearDialog.classList.remove("hidden");
    clearDialog.style.display = "flex"; // Visa dialogrutan
  }

  // Funktion för att gömma dialogrutan
  function hideDialog() {
    clearDialog.classList.add("hidden");
    clearDialog.style.display = "none"; // Göm dialogrutan
  }

  // Funktion för att tömma localStorage
  function clearLocalStorage() {
    localStorage.clear();
    alert("Alla poäng och spelad tid har raderats!");
    hideDialog();
  }

  // Lägg till event-lyssnare
  clearButton.addEventListener("click", showDialog);
  confirmClear.addEventListener("click", clearLocalStorage);
  cancelClear.addEventListener("click", hideDialog);
  closeButton.addEventListener("click", hideDialog);

  // Stäng dialogrutan om användaren klickar utanför popupen
  clearDialog.addEventListener("click", (event) => {
    if (event.target === clearDialog) {
      hideDialog();
    }
  });
});

/* CURSOR */
// Skapa den anpassade kursorn
cursor.id = "custom-cursor";
document.body.appendChild(cursor);

// Uppdatera kursorns position vid musens rörelse
document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Se till att kursorn syns över klickbara element
const clickableElements = document.querySelectorAll(
  "a, .clickable, .dropdown-button, .hitbox, [onclick]",
);

// Lägg till hover-effekt för alla klickbara element
clickableElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "2rem";
    cursor.style.height = "2rem";
    cursor.style.opacity = "0.9";
  });

  el.addEventListener("mouseleave", () => {
    cursor.style.width = "1.25rem";
    cursor.style.height = "1.25rem";
    cursor.style.opacity = "0.97";
  });
});
// CURSOR ENDS

function getCurrentLanguage() {
  return localStorage.getItem("language");
}

/* UPDATE STARS TA BORT*/

function updateStarsForLanguageChange() {
  updateStars(); // Uppdate stars for current language
}

/* function updatePage() {
  updateRounds();
  updateTotalTime();
  updateStars();
  // updateFlag();
} */

function updatePage() {
  updateStars();
  updateScore(); // stjärnor

  updateRoundsPerLanguage();
  updateTotalRounds();
  updateTimePerLanguage();
  updateTotalTimeAll();

  updateTitle();
  updateGameSeconds();
}

function updateFlag() {
  const flag = localStorage.getItem("languageFlag");
  const flagImg = document.getElementById("selected-flag");

  if (flag && flagImg) {
    flagImg.src = flag;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateFlag();
});

/* LOAD THE GAME CARDS & CATEGORY TITLE */
function registerCategories() {
  categories.forEach((category) => {
    const categoryElement = document.getElementById(category.id);

    if (categoryElement) {
      categoryElement.addEventListener("click", function () {
        localStorage.setItem("selectedCategory", category.name);
        localStorage.setItem(
          "categoryTitle",
          document.getElementById("cate-" + category.name).innerText,
        );
      });
    }
  });
}
// LOAD THE GAME ENDS

/* UPDATE ROUNDS AND TIME */

function updateRounds() {
  const element = document.getElementById("info-total-rounds");
  if (!element) return;

  const language = localStorage.getItem("language") || "english";
  const roundsKey = `rounds-${language}`;
  let rounds = localStorage.getItem(roundsKey) || 0;

  element.innerText = rounds;
}

/* function updateTotalRounds() {
  const totalRounds = parseInt(localStorage.getItem("rounds-all"), 10) || 0;
  document.getElementById("totalRounds").textContent = totalRounds;
} */

/* TEST */

// Totalt antal rundor per språk
// Totalt antal rundor per språk
function updateRoundsPerLanguage(
  language = localStorage.getItem("language") || "english",
) {
  const roundsKey = `rounds-${language}`;
  const rounds = parseInt(localStorage.getItem(roundsKey), 10) || 0;
  const el = document.getElementById("info-total-rounds-language");
  if (el) el.textContent = rounds;
  return rounds;
}

// Totalt antal rundor för alla språk
function updateTotalRounds() {
  let totalRounds = 0;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("rounds-")) {
      totalRounds += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });
  localStorage.setItem("rounds-all", totalRounds);
  const el = document.getElementById("info-total-rounds-all");
  if (el) el.textContent = totalRounds;
  return totalRounds;
}

// Total tid per språk
function updateTimePerLanguage(
  language = localStorage.getItem("language") || "english",
) {
  const timeKey = `time-${language}`;
  const time = parseInt(localStorage.getItem(timeKey), 10) || 0;
  const el = document.getElementById("info-total-time-language");
  if (el) el.textContent = formatTime(time);
  return time;
}

// Total tid för alla språk
function updateTotalTimeAll() {
  let totalTime = 0;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("time-")) {
      totalTime += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });
  localStorage.setItem("time-all", totalTime);
  const el = document.getElementById("info-total-time-all");
  if (el) el.textContent = formatTime(totalTime);
  return totalTime;
}

// Hjälpfunktion för att formatera tid mm:ss
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}.${seconds < 10 ? "0" : ""}${seconds}`;
}

// Hjälpfunktion för att formatera tid mm:ss
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}.${seconds < 10 ? "0" : ""}${seconds}`;
}
/* SLUT */

function updateTime(time, id) {
  time = parseInt(time, 10) || 0;

  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  let formattedTime = minutes + "." + (seconds < 10 ? "0" : "") + seconds;

  document.getElementById(id).innerText = formattedTime;
}

function updateTotalTime() {
  const element = document.getElementById("info-total-time");
  if (!element) return;

  const language = localStorage.getItem("language") || "english";
  const timeKey = `time-${language}`;

  let totalTime = localStorage.getItem(timeKey) || 0;
  updateTime(totalTime, "info-total-time");
}

/* POPUP - LANGUAGE */
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("languageModal");
  const flagBtn = document.getElementById("selected-flag");

  if (flagBtn && popup) {
    flagBtn.addEventListener("click", () => popup.open());
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateStarsPerLanguage();
  updateRoundsPerLanguage();
  updateTotalRounds();
  updateTimePerLanguage();
  updateTotalTimeAll();
});

document.addEventListener("language-changed", (e) => {
  const { language, flag } = e.detail;

  updateStars();
  updateTotalStarsForCurrentLanguage();

  if (typeof updateStars === "function") updateStars();
  if (typeof updateAllCategories === "function") {
    updateAllCategories(language);
  }

  const flagImg = document.getElementById("selected-flag");
  if (flagImg && flag) {
    flagImg.src = flag;
  }

  document
    .querySelectorAll("language-selector")
    .forEach((el) => el.loadCurrentLanguage());
});

/* UPDATE TOTAL STARS */

function updateTotalStarsForCurrentLanguage() {
  const language = localStorage.getItem("language") || "english";
  let totalStars = 0;

  categories.forEach((category) => {
    const key = `stars-${category.name}-${language}`;
    const stars = parseInt(localStorage.getItem(key), 10) || 0;
    totalStars += stars;
  });

  const element = document.getElementById("info-total-stars");
  if (element) element.textContent = totalStars;
}

function updateStars() {
  const language = localStorage.getItem("language") || "english";

  categories.forEach((category) => {
    const starsElement = document.getElementById("stars-" + category.name);
    if (!starsElement) return;

    const key = `stars-${category.name}-${language}`;
    let numberOfStars = parseInt(localStorage.getItem(key), 10) || 0;
    numberOfStars = Math.min(numberOfStars, maxNumberOfStartsPerCategory);

    starsElement.innerHTML = "";
    for (let i = 0; i < maxNumberOfStartsPerCategory; i++) {
      const isFilled = i < numberOfStars;
      const icon = isFilled ? "./icons/star_5d.svg" : "./icons/star_5d.svg";

      starsElement.innerHTML += `
    <img 
      class="star ${isFilled ? "star-filled" : "star-empty"}" 
      src="${icon}" 
      alt="${isFilled ? "Fylld stjärna" : "Tom stjärna"}"
    />
  `;
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  updateStars(); // Uppdaterar alla stjärnbehållare baserat på sparat språk
});

/* SCROLL-FUNCTION */
// Function to check if at bottom
function isAtBottom(element) {
  return element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
}

// Function to check if at top
function isAtTop(element) {
  return element.scrollTop === 0;
}

// Listen to scroll button
scrollButton.addEventListener("click", () => {
  if (isAtBottom(scrollArea)) {
    // If at bottom, scroll to top
    scrollArea.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Rotate to default "0"
    scrollButton.style.transform = "rotateX(0deg)";
  } else {
    // If not at bottom scroll to bottom
    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior: "smooth",
    });
    scrollButton.style.transform = "rotateX(180deg)";
  }
});

// Controlling scroll position
scrollArea.addEventListener("scroll", () => {
  if (isAtTop(scrollArea)) {
    // If at top, rotate arrow to "0"
    scrollButton.style.transform = "rotateX(0deg)";
  } else if (isAtBottom(scrollArea)) {
    // If at bottom, rotate "180"
    scrollButton.style.transform = "rotateX(180deg)";
  }
});
// Scroll-area ends

/* DROPDOWN SPARA TILLS VIDARE */
/* function toggleDropdown() {
  const dropdown = document.querySelector(".dd");
  dropdown.classList.toggle("dd--open");
} */

function updateAllCategories(selectedLanguageValue) {}

document.addEventListener("DOMContentLoaded", () => {
  updatePage(); // Uppdaterar runda, tid och stjärnor
  /*   loadLanguage(); // Laddar språk
   */
  /*   updateAllCategories(localStorage.getItem("language") || "ENG"); // Uppdatera kategorier
   */ updateTotalStarsForCurrentLanguage();
  /*   updateRounds();
   */ /*  updateStars(); */ // Uppdaterar stjärnvisning för att säkerställa att den visas korrekt
});

/* BANNER */
const dateSpan = document.getElementById("banner-date");
const today = new Date();
dateSpan.textContent = today.toLocaleDateString("sv-SE"); // t.ex. 2026-02-20
