// Shared JS

/* VARIABLES */
const scrollButton = document.getElementById("scroll-button");
const scrollArea = document.getElementById("scroll-area");
const cursor = document.createElement("div");
const maxNumberOfStartsPerCategory = 5;

// ARRAY WITH CATEGORIES
const categories = [
  { id: "fruits-game_1", name: "fruits_1" },
  { id: "vegetables-game_1", name: "vegetables_1" },
  { id: "animals-game_1", name: "animals_1" },
  { id: "dishes-game_1", name: "dishes_1" },
  { id: "drinks-game_1", name: "drinks_1" },
  { id: "colours-game_1", name: "colours_1" },
  { id: "fruits-game_2", name: "fruits_2" },
];

/* HIDE MOUSE FOR IPAD ETC */
document.addEventListener("DOMContentLoaded", () => {
  const isTouchDevice = matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  if (isTouchDevice) {
    document.querySelector("#custom-cursor").style.display = "none";
    document.documentElement.style.cursor = "auto"; // Återställ standardcursor
  }
});

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
    ".section_text, .container_text-animation"
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
  "a, .clickable, .dropdown-button, .hitbox, [onclick]"
);

// Lägg till hover-effekt för alla klickbara element
clickableElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "2.5rem";
    cursor.style.height = "2.5rem";
    cursor.style.opacity = "0.9";
  });

  el.addEventListener("mouseleave", () => {
    cursor.style.width = "1.25rem";
    cursor.style.height = "1.25rem";
    cursor.style.opacity = "0.95";
  });
});
// CURSOR ENDS

/* UPDATE STARS */
function updateStars() {
  const language = localStorage.getItem("language") || "engleska";

  categories.forEach((category) => {
    const starsElement = document.getElementById("stars-" + category.name);

    if (!starsElement) {
      return; // Hoppa över om elementet saknas
    }

    const key = `stars-${category.name}-${language}`;
    let numberOfStars = localStorage.getItem(key) || 0;

    numberOfStars = Math.min(numberOfStars, maxNumberOfStartsPerCategory);
    starsElement.innerHTML = "";

    for (let i = 0; i < numberOfStars; i++) {
      starsElement.innerHTML += `<img class="star" src="./icons/star_full.png" alt="Star for points"/>`;
    }
  });
}

function updateStarsForLanguageChange() {
  updateStars(); // Uppdate stars for current language
}

function updatePage() {
  updateRounds();
  updateTotalTime();
  updateStars();
  // updateFlag();
}

/* LOAD THE GAME CARDS & CATEGORY TITLE */
function registerCategories() {
  categories.forEach((category) => {
    const categoryElement = document.getElementById(category.id);

    if (categoryElement) {
      categoryElement.addEventListener("click", function () {
        localStorage.setItem("selectedCategory", category.name);
        localStorage.setItem(
          "categoryTitle",
          document.getElementById("cate-" + category.name).innerText
        );
      });
    }
  });
}
// LOAD THE GAME ENDS

/* UPDATE ROUNDS AND TIME */
function updateRounds() {
  let rounds = localStorage.getItem("totalRounds") || 0;
  document.getElementById("info-rounds").innerText = rounds;
}

function updateTime(time, id) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  document.getElementById(id).innerText = minutes + "." + seconds;
}

function updateTotalTime() {
  let totalTime = localStorage.getItem("totalTime");
  updateTime(totalTime, "info-totaltime");
}

/* FUNCTIONS FOR THE POPUP "AVSLUTA" */
function registerPopup() {
  let popup = document.querySelector("#popUpId");
  let closeElements = document.querySelectorAll(".button_close");
  let langButton = document.querySelector("#choose_language");

  langButton.onclick = function () {
    // When the user clicks the button, open the popup
    popup.style.display = "flex";
    popup.style.animationPlayState = "running"; // Starta animationen
    //popup.classList.add("fade");
  };

  closeElements.forEach((e) => {
    e.onclick = function () {
      popup.style.display = "none";
      // popup.classList.remove("fade");
    };
  });

  window.onclick = function (event) {
    // When the user clicks anywhere outside of the popup, close it
    if (event.target == popup) {
      popup.style.display = "none";
      // popup.classList.remove("fade");
    }
  };
}

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

/* DROPDOWN */
function toggleDropdown() {
  const dropdown = document.querySelector(".dd");
  dropdown.classList.toggle("dd--open");
}

function updateAllCategories(selectedLanguageValue) {}

// Hämtar och visar valt språk vid sidladdning
function loadLanguage() {
  const savedLanguage = localStorage.getItem("language") || "ENG"; // Standardvärde
  const titleElement = document.getElementById("ddTitle");
  const selectedOption = document.querySelector(
    `.dd__item[data-value="${savedLanguage}"]`
  );

  // Updating menu title
  if (selectedOption) {
    titleElement.textContent = selectedOption.textContent.slice(0, 3);
    selectedOption.classList.add("selected-language");
  } else {
    // Om inget språk är sparat, sätt standardtexten
    titleElement.textContent = "ENG";
  }

  updateStars(); // Uppdatera stjärnorna baserat på valt språk
  updateAllCategories(savedLanguage);
}

function selectOption(element) {
  // Ta bort markeringsklassen från alla språk innan vi markerar det valda
  const allOptions = document.querySelectorAll(".dd__item");
  allOptions.forEach((option) => option.classList.remove("selected-language"));

  const selectedLanguageValue = element.getAttribute("data-value");
  const selectedTitle = element.getAttribute("data-title");
  /*   const selectedLanguageText = element.textContent.trim();
   */

  // Uppdatera headern för att visa valt språk
  /*   document.getElementById("ddTitle").textContent = selectedLanguageText.slice(
    0,
    3
  );
 */

  document.getElementById("ddTitle").textContent = selectedTitle;

  // Lägg till markeringsklassen på det valda språket
  element.classList.add("selected-language");

  /// Spara endast data-value i localStorage för språkinställningen
  localStorage.setItem("language", selectedLanguageValue);

  // Uppdatera alla kategorier med det nya språket
  updateAllCategories(selectedLanguageValue);

  // Uppdatera stjärnorna omedelbart vid språkbyte, inte som tidigare i updateStarsForLanguageChange
  updateStars();

  // Stäng dropdown
  toggleDropdown();

  console.log("Valt språk:", selectedLanguageValue);
  console.log("Språk i localStorage:", localStorage.getItem("language"));
}

function loadLanguage() {
  const savedLanguage = localStorage.getItem("language") || "english"; // Standardvärde
  const selectedOption = document.querySelector(
    `.dd__item[data-value="${savedLanguage}"]`
  );

  if (selectedOption) {
    // Hämta titeln från data-title
    const selectedTitle = selectedOption.getAttribute("data-title");
    document.getElementById("ddTitle").textContent = selectedTitle;

    // Lägg till markeringsklass på valt språk
    selectedOption.classList.add("selected-language");
  } else {
    // Om inget språk är sparat, sätt standardtitel
    document.getElementById("ddTitle").textContent = "ENG";
  }

  // Uppdatera stjärnor och kategorier
  updateAllCategories(savedLanguage);
  updateStars();
}

document.addEventListener("DOMContentLoaded", () => {
  updatePage(); // Uppdaterar runda, tid och stjärnor
  loadLanguage(); // Laddar språk
  updateAllCategories(localStorage.getItem("language") || "ENG"); // Uppdatera kategorier

  updateStars(); // Uppdaterar stjärnvisning för att säkerställa att den visas korrekt
});
