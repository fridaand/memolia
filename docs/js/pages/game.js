let cards = [];
let firstCard = null;
let secondCard = null;
let score = 0;
let timer = 0;
let timerInterval;
let isMuted = false;
let isPaused = false;
let lastAudio = undefined;

let popup = document.getElementById("popUpId"); // Get the popup
let xButton = document.getElementById("button_trigger"); // Get the button that opens the popup
let closeElements = document.querySelectorAll(".button_close"); // Get the element that closes the popup
const goBackButton = document.getElementById("goBackButton");

const flagLeft = document.querySelector(".flag-left");
const flagRight = document.querySelector(".flag-right");
const toggleBtn = document.getElementById("toggle-translation");

const tooltip = toggleBtn.querySelector(".icon-wrapper tooltip");

let translationMode = false;

/* function getCurrentLanguage() {
  return localStorage.getItem("language") || "english";
} */

function logStorageStatus() {
  console.log("=== LOCAL STORAGE STATUS ===");
  console.log("Current language:", getCurrentLanguage());
  Object.keys(localStorage)
    .filter(
      (key) =>
        key.includes("time") || key.includes("rounds") || key.includes("stars"),
    )
    .forEach((key) => console.log(key, "=", localStorage.getItem(key)));
  console.log("============================");
}

function updateToggleFlags() {
  const selectedLang = getCurrentLanguage();

  const flagMap = {
    english: "icons/flag/english-br.svg",
    french: "icons/flag/french-fr.svg",
    swedish: "icons/flag/swedish.svg",
    "portuguese-br": "icons/flag/portuguese-br.svg",
  };

  const tooltipEl = toggleBtn.parentElement.querySelector(".tooltip");

  if (!translationMode) {
    flagLeft.src = flagMap[selectedLang];
    flagRight.src = flagMap[selectedLang];
    tooltipEl.textContent = "Visa översättning";
  } else {
    flagLeft.src = flagMap[selectedLang];
    flagRight.src = flagMap["swedish"];
    tooltipEl.textContent = "Visa valt språk";
  }
}

toggleBtn.addEventListener("click", () => {
  translationMode = !translationMode;
  updateCardTexts(); // uppdatera korten
  updateToggleFlags(); // uppdatera flaggor + tooltip
});

/* test */
function updateCardTexts() {
  const allCards = document.querySelectorAll(".card");
  const grouped = {};
  const selectedLang = getCurrentLanguage(); // ✅ hämta EN gång

  // gruppera kort per namn
  allCards.forEach((card) => {
    const name = card.dataset.baseName;
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(card);
  });

  Object.values(grouped).forEach((pair) => {
    const baseName = pair[0].dataset.baseName;
    const cardData = cards.find((c) => c.name === baseName);

    if (!translationMode) {
      // båda kort samma språk
      pair.forEach((cardEl) => {
        cardEl.dataset.currentLanguage = selectedLang;
        cardEl.querySelector(".card-text").textContent =
          cardData.language[selectedLang];
      });
    } else {
      // ett kort = valt språk
      pair[0].dataset.currentLanguage = selectedLang;
      pair[0].querySelector(".card-text").textContent =
        cardData.language[selectedLang];

      // ett kort = svenska
      pair[1].dataset.currentLanguage = "swedish";
      pair[1].querySelector(".card-text").textContent =
        cardData.language["swedish"];
    }
  });
}

// VISIT EARLIER PAGE OR MENU.HTML
goBackButton.addEventListener("click", function () {
  window.location.href = "menu.html";
});

// FUNCTIONS FOR CLOSING POPUP "AVSLUTA"
xButton.onclick = function () {
  // When the user clicks the button, open the popup
  popup.style.display = "flex";
};

closeElements.forEach((e) => {
  e.onclick = function () {
    popup.style.display = "none";
  };
});

window.onclick = function (event) {
  // When clicking outside of the popup, close it
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

function shuffleCards(array) {
  let currentIndex = array.length;
  let randomIndex, temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}

// CHANGE LANGUAGE
function changeLanguage(newLanguage) {
  localStorage.setItem("language", newLanguage);

  generateBoard(getBoardSize());
  updateStatisticsUI(); // uppdatera poäng, tid, stjärnor, rundor
  updateGameUI(); // uppdatera score, timer, titel
  updateToggleFlags(); // uppdatera flaggor
}

function generateCardDiv(card) {
  const selectedLang = getCurrentLanguage();
  return `
  <div class="front">
  <img class="front-image" alt="" aria-hidden="true" src=${card.image} />
  <p class="card-text">${card.language[selectedLang]}</p>
</div>
<div class="back"></div>
    `;
}

function generateCards(cardsForBoard) {
  /* function generateCards() */
  const gridContainer = document.querySelector(".container_game");
  gridContainer.innerHTML = ""; // rensa spelplanen först

  cardsForBoard.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.dataset.baseName = card.name;
    cardEl.dataset.currentLanguage = getCurrentLanguage();
    cardEl.innerHTML = generateCardDiv(card);

    cardEl.clickTrigger = function () {
      if (isPaused || (firstCard && secondCard)) return;

      if (!isMuted) {
        const cardData = cards.find((c) => c.name === this.dataset.baseName);
        const languageToPlay =
          this.dataset.currentLanguage || getCurrentLanguage();
        playCardSound(cardData.audio[languageToPlay]);
      }

      flipCard.call(this);
    };

    cardEl.addEventListener("click", cardEl.clickTrigger);
    gridContainer.appendChild(cardEl);
  });
}

// Generera bräde med rätt antal kort
function generateBoard(boardSize) {
  firstCard = null;
  secondCard = null;

  const numPairs = boardSize / 2;
  const selectedCards = cards.slice(0, numPairs);
  const cardsForBoard = [...selectedCards, ...selectedCards]; // duplicera par
  shuffleCards(cardsForBoard);
  generateCards(cardsForBoard);
}

// Lyssna på boardSize ändring
document.addEventListener("boardSizeChanged", (e) => {
  if (cards.length > 0) generateBoard(e.detail.boardSize);
});

function playCardSound(audioSrc) {
  lastAudio = new Audio(audioSrc);
  lastAudio.play();
}

function flipCard() {
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    startTimer();
    return;
  } else secondCard = this;
  score++;
  updateScore();
  checkForMatch();
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (!isPaused) {
        timer++;
        updateGameSeconds();
      }
    }, 1000);
  }
}

/* function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
} */

function checkForMatch() {
  const isMatch = firstCard.dataset.baseName === secondCard.dataset.baseName;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", firstCard.clickTrigger);
  secondCard.removeEventListener("click", secondCard.clickTrigger);
  resetBoard();

  // Kolla om spelet är slut
  if (document.querySelectorAll(".card:not(.flipped)").length === 0) {
    /*    console.log("END GAME language:", getCurrentLanguage());
    console.log("Timer this round:", timer);
    console.log("Saved total time:", localStorage.getItem("time-all")); */

    Object.keys(localStorage)
      .filter(
        (key) =>
          key.includes("time") ||
          key.includes("rounds") ||
          key.includes("stars"),
      )
      .forEach((key) => console.log(key, "=", localStorage.getItem(key)));
    console.log("============================");

    endGame();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
}

function updateGameSeconds() {
  document.querySelectorAll(".info-seconds").forEach((span) => {
    span.innerText = timer;
  });
}

function registerMuteButton() {
  const muteButton = document.getElementById("button-mute");
  const iconSound = document.getElementById("sound-icon");
  muteButton.addEventListener("click", () => {
    isMuted = !isMuted;

    iconSound.src = isMuted
      ? "icons/buttons/button_sound_off.svg"
      : "icons/buttons/button_sound_on.svg";
  });
}

/* function increaseTotalTime() {
  let previousTotalTime = parseInt(localStorage.getItem("totalTime")) || 0;
  let currentTotalTime = previousTotalTime + timer;
  localStorage.setItem("totalTime", currentTotalTime);
} */

/* function increaseTotalTime() {
  const language = localStorage.getItem("language") || "english";
  const timeKey = `time-${language}`; */
function increaseTotalTime() {
  const timeKey = `time-${currentLanguage}`;

  let previousTotalTime = parseInt(localStorage.getItem(timeKey), 10) || 0;

  let currentTotalTime = previousTotalTime + timer;

  localStorage.setItem(timeKey, currentTotalTime);
}
function increaseTotalTimeAll() {
  const totalTimeKey = "time-all";
  let totalTime = parseInt(localStorage.getItem(totalTimeKey), 10) || 0;
  totalTime += timer;
  localStorage.setItem(totalTimeKey, totalTime);
}

/* function increaseRounds() {
  let rounds = localStorage.getItem("totalRounds") || 0;
  localStorage.setItem("totalRounds", ++rounds);
} */
function increaseRounds() {
  /*   const language = localStorage.getItem("language") || "english";
  const roundsKey = `rounds-${language}`; */
  const roundsKey = `rounds-${currentLanguage}`;

  let rounds = parseInt(localStorage.getItem(roundsKey), 10) || 0;

  rounds++;

  localStorage.setItem(roundsKey, rounds);
}
function increaseTotalRounds() {
  const totalRoundsKey = "rounds-all";
  let totalRounds = parseInt(localStorage.getItem(totalRoundsKey), 10) || 0;
  totalRounds++;
  localStorage.setItem(totalRoundsKey, totalRounds);
}

/* function increaseStars() {
  const category = localStorage.getItem("selectedCategory");
  const language = localStorage.getItem("language") || "english";
  const key = `stars-${category}-${language}`; */
function increaseStars() {
  const category = localStorage.getItem("selectedCategory");
  /*   const key = `stars-${category}-${currentLanguage}`;
   */
  const selectedLang = getCurrentLanguage();
  const key = `stars-${category}-${selectedLang}`;

  let stars = localStorage.getItem(key) || 0;
  stars = parseInt(stars, 10) + 1;
  localStorage.setItem(key, stars);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timer = 0;
}

/* const message = getRandomMessage();
 */
const successMessagesSlow = [
  "Det där gjorde du bra!",
  "Helt fantastiskt!",
  "Snyggt jobbat!",
  "Grymt jobbat!",
  "Strålande insats!",
  "Vilket proffs du är!",
];
const successMessagesFast = [
  "Helt otroligt! Snabbare än blixten!",
  "Wow, det där var riktigt imponerande!",
  "Du måste ha fotografiskt minne!? Det där var mästerligt!",
  "Det här var nästan olagligt snabbt!",
];

function hideGameInfo() {
  document.querySelector(".article_game-info").style.display = "flex";
}

function showGameInfo() {
  document.querySelector(".article_game-info").style.display = "flex";
}

function getRandomMessage() {
  const timeTaken = parseInt(
    document.querySelector(".info-seconds").textContent,
    10,
  );

  if (timeTaken < 45) {
    return successMessagesFast[
      Math.floor(Math.random() * successMessagesFast.length)
    ];
  } else {
    return successMessagesSlow[
      Math.floor(Math.random() * successMessagesSlow.length)
    ];
  }
  /*   const randomIndex = Math.floor(Math.random() * successMessages.length);
  return successMessages[randomIndex]; */
}

function hideEndGameInfo() {
  document.querySelector(".section_end-game").style.display = "none";
}

// POPUP WHEN GAME IS FINISHED (MESSAGE, ANIMATION)
function showEndGameInfo() {
  document.querySelector(".section_end-game").style.display = "flex";

  // GENERATE RANDOM MESSAGE
  const popupText = document.getElementById("popupText");
  popupText.textContent = getRandomMessage();
  popupText.classList.add("animate-text");

  // REMOVE POPUP-TEXT ANIMATION AFTER 1500 MS
  setTimeout(() => {
    popupText.classList.remove("animate-text");
  }, 1500);

  // PLAY ANIMATION
  const animationContainer = document.querySelector(".lottie-container");

  // "CLEAN"/RESET EARLIER ANIMATION
  animationContainer.innerHTML = "";

  // ADD & PLAY ANIMATION
  lottie.loadAnimation({
    container: animationContainer,
    renderer: "svg",
    loop: 1,
    autoplay: true,
    path: "./animations/confetti_01.json",
  });
}

function resetScore() {
  score = 0;
  updateScore();
}

function resetCards() {
  const gridContainer = document.querySelector(".container_game");
  gridContainer.innerHTML = "";
}

/* FUNCTION FOR PAUSE BUTTON */
function pause() {
  const playPause = document.getElementById("play-pause");
  const pauseButton = document.getElementById("button-pause");

  if (isPaused) {
    isPaused = false;
    playPause.src = "./icons/buttons/button_pause_default.svg";

    pauseButton.classList.remove("pulse-effect");

    document.removeEventListener("click", handleOutsideClick);
  } else {
    isPaused = true;
    playPause.src = "./icons/buttons/button_pause_off.svg";

    document.addEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const pauseButton = document.getElementById("button-pause");

  // Om det klickade elementet INTE är pausknappen
  if (!pauseButton.contains(event.target) && isPaused) {
    pauseButton.classList.add("pulse-effect");

    setTimeout(() => {
      pauseButton.classList.remove("pulse-effect");
    }, 1500);
  }
}

function getBoardSize() {
  return parseInt(localStorage.getItem("boardSize")) || 12;
}

// Ladda kort från kategori
function main() {
  const category = localStorage.getItem("selectedCategory");
  fetch(`./data/${category}.json`)
    .then((res) => res.json())
    .then((data) => {
      cards = [...data];
      shuffleCards(cards);

      generateBoard(getBoardSize());
      updateStatisticsUI(); // uppdatera totaler/statistik
      updateGameUI(); // uppdatera runda/timer/titel
      updateToggleFlags();
    });
}

// WHEN GAME STARTS
function restartGame() {
  hideEndGameInfo();
  showGameInfo();
  resetBoard();
  resetScore();
  resetCards();
  resetTimer();

  generateBoard(getBoardSize());
  updateStatisticsUI(); // uppdatera statistik
  updateGameUI(); // uppdatera spel-UI
}

// --- SPEL SLUT ---
/* function registerGameEnd() {
  const selectedLang = getCurrentLanguage();
  const category = localStorage.getItem("selectedCategory");

  console.log("=== GAME END ===");
  console.log("Language:", selectedLang);
  console.log("Category:", category);
  console.log("Timer:", timer);

  addToStorage(`time-${selectedLang}`, timer);
  addToStorage(`rounds-${selectedLang}`, 1);
  addToStorage(`stars-${category}-${selectedLang}`, 1);
} */
function registerGameEnd() {
  const selectedLang = getCurrentLanguage();
  const category = localStorage.getItem("selectedCategory");
  const boardSize = getBoardSize();
  const starPoints = getStarPoints(boardSize);

  // --- RUNDOR ---
  addToStorage(`rounds-${selectedLang}`, 1);
  addToStorage(`rounds-${category}-${selectedLang}`, 1);

  // --- TID ---
  addToStorage(`time-${selectedLang}`, timer);
  addToStorage(`time-${category}-${selectedLang}`, timer);

  // --- STJÄRNPOÄNG ---
  addToStorage(`stars-${category}-${selectedLang}`, starPoints);
}

function addToStorage(key, value) {
  const prev = parseInt(localStorage.getItem(key), 10) || 0;
  const newValue = prev + value;
  localStorage.setItem(key, newValue);

  console.log("Updated:", key, newValue);
}

function endGame() {
  const category = localStorage.getItem("selectedCategory");
  clearInterval(timerInterval);
  timerInterval = null;

  registerGameEnd();

  showEndGameInfo();

  updateStatisticsUI();
  updateGameUI();

  // VISA POPUP EFTER 500ms
  setTimeout(() => {
    showEndGameInfo();
  }, 2000);
  /* resetTimer(); */
}

function updateGameUI() {
  updateScore();
  updateGameSeconds();
  updateTitle();
}

function updateScore() {
  document.querySelectorAll(".score").forEach((span) => {
    span.textContent = score;
  });
}

function updateTitle() {
  document.getElementById("cate").innerText =
    localStorage.getItem("categoryTitle");
}

document.addEventListener("DOMContentLoaded", function () {
  hideEndGameInfo();
  showGameInfo();
  registerMuteButton();
  timer = 0;
  updateGameSeconds();
  updateGameUI();
  main();
  updateToggleFlags();
});
