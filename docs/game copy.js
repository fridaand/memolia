let cards = [];
let firstCard = null;
let secondCard = null;
let score = 0;
let timer = 0;
let timerInterval;
let isMuted = false;
let isPaused = false;
let lastAudio = undefined;
let currentLanguage = localStorage.getItem("language") || "english";

let popup = document.getElementById("popUpId"); // Get the popup
let xButton = document.getElementById("button_trigger"); // Get the button that opens the popup
let closeElements = document.querySelectorAll(".button_close"); // Get the element that closes the popup
const goBackButton = document.getElementById("goBackButton");

const boardSize = localStorage.getItem("boardSize") || "12"; // default

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

function updateScore() {
  document.querySelectorAll(".score").forEach((span) => {
    span.textContent = score;
  });
}

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function updateTitle() {
  document.getElementById("cate").innerText =
    localStorage.getItem("categoryTitle");
}

// CHANGE LANGUAGE
function changeLanguage(newLanguage) {
  currentLanguage = newLanguage;
  regenerateCards();
}

function generateCardDiv(card) {
  const language = currentLanguage === "french" ? "french" : "english";
  return `
  <div class="front">
  <img class="front-image" alt="" aria-hidden="true" src=${card.image} />
  <p class="card-text">${card.language[currentLanguage]}</p>
</div>
<div class="back"></div>
    `;
}

function generateCards(cardsForBoard) {
  /* function generateCards() */
  const gridContainer = document.querySelector(".container_game");
  gridContainer.innerHTML = ""; // rensa spelplanen först

  for (let card of cardsForBoard) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = generateCardDiv(card);
    gridContainer.appendChild(cardElement);

    cardElement.clickTrigger = function () {
      if (isPaused || (firstCard && secondCard)) {
        return;
      }

      if (!isMuted) {
        let audioLanguage;

        if (currentLanguage === "french") {
          audioLanguage = "french";
        } else if (currentLanguage === "swedish") {
          audioLanguage = "swedish";
        } else if (currentLanguage === "portuguese-br") {
          audioLanguage = "portuguese-br";
        } else {
          audioLanguage = "english";
        }

        playCardSound(card.audio[audioLanguage]);
      }

      flipCard.call(this);
    };

    cardElement.addEventListener("click", cardElement.clickTrigger);
  }
}

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
  }

  secondCard = this;
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

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", firstCard.clickTrigger);
  secondCard.removeEventListener("click", secondCard.clickTrigger);
  resetBoard();
  if (document.querySelectorAll(".card:not(.flipped)").length === 0) {
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

function updatePage() {
  updateRounds();
  updateScore();
  updateTitle();
  updateTotalTime();
  updateGameSeconds();
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

function increaseTotalTime() {
  let previousTotalTime = parseInt(localStorage.getItem("totalTime")) || 0;
  let currentTotalTime = previousTotalTime + timer;
  localStorage.setItem("totalTime", currentTotalTime);
}

function increaseRounds() {
  let rounds = localStorage.getItem("totalRounds") || 0;
  localStorage.setItem("totalRounds", ++rounds);
}

function increaseStars() {
  const category = localStorage.getItem("selectedCategory");
  const language = localStorage.getItem("language") || "engelska";
  const key = `stars-${category}-${language}`;

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
    10
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

// WHEN GAME IS OVER
function endGame() {
  increaseRounds();
  increaseTotalTime();
  increaseStars();
  updatePage();
  resetTimer();
  hideGameInfo();
  showEndGameInfo();
}

// WHEN GAME STARTS
function restartGame() {
  hideEndGameInfo();
  showGameInfo();
  resetBoard();
  resetScore();
  resetCards();
  shuffleCards();
  generateBoard(boardSize); //TEST
  generateCards();
  updatePage();
}

// TEST
function generateBoard(boardSize) {
  const numPairs = boardSize / 2;
  const gridContainer = document.querySelector(".container_game");
  gridContainer.innerHTML = "";

  const selectedCards = cards.slice(0, numPairs); // cards måste vara laddat
  const cardsForBoard = [...selectedCards, ...selectedCards];
  shuffle(cardsForBoard);

  generateCards(cardsForBoard); // Skicka alltid arrayen
}

function main() {
  let category = localStorage.getItem("selectedCategory");

  fetch(`./data/${category}.json`)
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data]; // duplicera alla
      shuffleCards();

      // Skapa initialt bräde
      const boardSize = parseInt(localStorage.getItem("boardSize")) || 12;
      generateBoard(boardSize);
    });
}

// Lyssna på boardSize-changes
document.addEventListener("boardSizeChanged", (e) => {
  // Bara uppdatera om cards redan är laddat
  if (cards.length > 0) {
    generateBoard(e.detail.boardSize);
  }
});

main();

//TS
//ORGINAL
/* function main() {
  let category = localStorage.getItem("selectedCategory");


   fetch("./data/" + category + ".json")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data];
      shuffleCards();

      generateCards();
    });  */

// TEST
// Hämta valt boardSize från settings
/*       const boardSize = parseInt(localStorage.getItem("boardSize")) || 12;
      updateBoardSize(boardSize);


      const numPairs = boardSize / 2;

      // Begränsa till rätt antal par
      const selectedCards = cards.slice(0, numPairs * 2); // slice tar antal kort, *2 eftersom vi duplicerade alla

      // Skicka dessa kort till generateCards
      generateCards(selectedCards); */

/*    const boardSize = parseInt(localStorage.getItem("boardSize")) || 12;
      generateBoard(boardSize); */

//TEST2B

/*   fetch("./data/" + category + ".json")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data]; // duplicera alla
      shuffleCards();

      const boardSize = parseInt(localStorage.getItem("boardSize")) || 12;
      generateBoard(boardSize); // <-- skapar spelplanen med rätt antal kort
    });
  //TEST2S
}

main(); */

/* //TEST
// Funktion för att uppdatera spelplanen när boardSize ändras
function updateBoardSize() {
  const boardSize = parseInt(localStorage.getItem("boardSize")) || 12;
  const numPairs = boardSize / 2;
  const selectedCards = cards.slice(0, numPairs * 2);

  generateCards(selectedCards);
}

// Exempel: lyssna på en custom event från settings.html
document.addEventListener("boardSizeChanged", updateBoardSize);

//TEST SLUT */

document.addEventListener("DOMContentLoaded", function () {
  hideEndGameInfo();
  showGameInfo();
  registerMuteButton();
  updatePage();
  updateStars();
});
