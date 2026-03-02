/* STATISTICS */

class StatisticsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
              <div class="icon-wrapper" aria-label="Visa statistik">
                <div class="wrapper_text-min" id="statistics-trigger">                  
                <img class="star-big icon_md" src="./icons/star_5c.svg" />
                  
                
                <div> <p class="p_mini">Stjärnor </p>
                <span class="test" id="info-total-stars"></span>
                </div>
                
                <div> <p class="p_mini">Tot spelade spel (språk) </p>
                <span class="test" id="info-total-rounds-language"></span>
                </div>

                 <div> <p class="p_mini">Tot spelade spel (alla språk) </p>
                 <span class="test" id="info-total-rounds-all"></span>
                </div>

                 <div> <p class="p_mini">Total tid (språk) </p>
                 <span class="test" id="info-total-time-language"></span>
                </div>

                   <div> <p class="p_mini">Total tid (alla språk) </p>
                 <span class="test" id="info-total-time-all"></span>  
                </div>

              </div>
  `;
  }
}

// --- FORMAT TIME ---
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// --- TOTAL TID FÖR ALLA SPRÅK ---
function updateTotalTimeAll() {
  let totalTime = 0;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("time-") && key !== "time-all") {
      totalTime += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  /*   localStorage.setItem("time-all", totalTime);
   */
  const el = document.getElementById("info-total-time-all");
  if (el) el.textContent = formatTime(totalTime);
  return totalTime;
}

// --- TID PER SPRÅK ---
function updateTimePerLanguage() {
  const selectedLang = getCurrentLanguage();
  const time = parseInt(localStorage.getItem("time-" + selectedLang), 10) || 0;
  const el = document.getElementById("info-total-time-language");
  if (el) el.textContent = formatTime(time);
  return time;
}

/* function updateRoundsPerLanguage() {
  const element = document.getElementById("info-total-rounds");
  if (!element) return;

  const language = localStorage.getItem("language") || "english";
  const roundsKey = `rounds-${language}`;
  let rounds = localStorage.getItem(roundsKey) || 0;

  element.innerText = rounds;
} */

// --- TOTAL RUNDOR PER SPRÅK ---
function updateRoundsPerLanguage() {
  const selectedLang = getCurrentLanguage();
  const rounds =
    parseInt(localStorage.getItem("rounds-" + selectedLang), 10) || 0;
  const el = document.getElementById("info-total-rounds-language");

  if (el) el.textContent = rounds;
  return rounds;
}

/* // --- TOTAL RUNDOR ALLA SPRÅK ---
function updateTotalRounds() {
  const totalRounds = parseInt(localStorage.getItem("rounds-all"), 10) || 0;
  const el = document.getElementById("info-total-rounds-all");
  if (el) el.textContent = totalRounds;
  return totalRounds;
} */

function updateTotalRounds() {
  let totalRounds = 0;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("rounds-") && key.split("-").length === 2) {
      totalRounds += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  const el = document.getElementById("info-total-rounds-all");
  if (el) el.textContent = totalRounds;

  return totalRounds;
}

// --- TOTAL STARS ---

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

/* function updateStars() {
  const totalStars = parseInt(localStorage.getItem("stars-all"), 10) || 0;
  const el = document.getElementById("info-total-stars");
  if (el) el.textContent = totalStars;
  return totalStars;
} */

function getStarsForCategory(category) {
  const selectedLang = getCurrentLanguage();
  return (
    parseInt(localStorage.getItem(`stars-${category}-${selectedLang}`), 10) || 0
  );
}

function getTotalStarsForLanguage(selectedLang) {
  let total = 0;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("stars-") && key.endsWith(`-${selectedLang}`)) {
      total += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  return total;
}

function getTotalStarsAllLanguages() {
  let total = 0;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("stars-")) {
      total += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  return total;
}
function getTimeForCategory(category) {
  const selectedLang = getCurrentLanguage();
  return (
    parseInt(localStorage.getItem(`time-${category}-${selectedLang}`), 10) || 0
  );
}

function getRoundsForCategory(category) {
  const selectedLang = getCurrentLanguage();
  return (
    parseInt(localStorage.getItem(`rounds-${category}-${selectedLang}`), 10) ||
    0
  );
}

function updateStarsForLanguageChange() {
  updateStars(); // Uppdate stars for current language
}

function updateStatisticsUI() {
  updateStars();
  updateTotalStarsForCurrentLanguage();
  updateScore();
  updateRoundsPerLanguage();
  updateTotalRounds();
  updateTimePerLanguage();
  updateTotalTimeAll();
}

function updateFlag() {
  const flag = localStorage.getItem("languageFlag");
  const flagImg = document.getElementById("selected-flag");

  if (flag && flagImg) {
    flagImg.src = flag;
  }
}
/* TEST 2 SLUT */

customElements.define("statistics-modal", StatisticsModal);

/* TEST 2 */
/* 
function getCurrentLanguage() {
  return localStorage.getItem("language") || "english";
}
// --- FORMAT TIME ---
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// --- TOTAL TID FÖR ALLA SPRÅK ---
function updateTotalTimeAll() {
  let totalTime = 0;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("time-") && key !== "time-all") {
      totalTime += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });


  const el = document.getElementById("info-total-time-all");
  if (el) el.textContent = formatTime(totalTime);
  return totalTime;
}

// --- TID PER SPRÅK ---
function updateTimePerLanguage() {
  const lang = getCurrentLanguage();
  const time = parseInt(localStorage.getItem("time-" + lang), 10) || 0;
  const el = document.getElementById("info-total-time-language");
  if (el) el.textContent = formatTime(time);
  return time;
}


// --- TOTAL RUNDOR PER SPRÅK ---
function updateRoundsPerLanguage() {
  const lang = getCurrentLanguage();
  const rounds = parseInt(localStorage.getItem("rounds-" + lang), 10) || 0;
  const el = document.getElementById("info-total-rounds-language");
  if (el) el.textContent = rounds;
  return rounds;
}


function updateTotalRounds() {
  let totalRounds = 0;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("rounds-") && key.split("-").length === 2) {
      totalRounds += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  const el = document.getElementById("info-total-rounds-all");
  if (el) el.textContent = totalRounds;

  return totalRounds;
}

// --- TOTAL STARS ---

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

function getStarPoints(boardSize) {
  const starMap = {
    4: 2,
    6: 1,
    12: 2,
    16: 3,
    20: 4,
  };

  return starMap[boardSize] || 0;
}

function getStarsForCategory(category) {
  const selectedLang = getCurrentLanguage();
  return (
    parseInt(localStorage.getItem(`stars-${category}-${selectedLang}`), 10) || 0
  );
}

function getTotalStarsForLanguage(selectedLang) {
  let total = 0;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("stars-") && key.endsWith(`-${selectedLang}`)) {
      total += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  return total;
}

function getTotalStarsAllLanguages() {
  let total = 0;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("stars-")) {
      total += parseInt(localStorage.getItem(key), 10) || 0;
    }
  });

  return total;
}
function getTimeForCategory(category) {
  const selectedLang = getCurrentLanguage();
  return (
    parseInt(localStorage.getItem(`time-${category}-${selectedLang}`), 10) || 0
  );
}

function getRoundsForCategory(category) {
  const selectedLang = getCurrentLanguage();
  return (
    parseInt(localStorage.getItem(`rounds-${category}-${selectedLang}`), 10) ||
    0
  );
} 

function updateStarsForLanguageChange() {
  updateStars(); // Uppdate stars for current language
}

function updateStatisticsUI() {
  updateStars();
  updateTotalStarsForCurrentLanguage();
  updateScore();
  updateRoundsPerLanguage();
  updateTotalRounds();
  updateTimePerLanguage();
  updateTotalTimeAll();
}

function updateFlag() {
  const flag = localStorage.getItem("languageFlag");
  const flagImg = document.getElementById("selected-flag");

  if (flag && flagImg) {
    flagImg.src = flag;
  }
}
  */
/* TEST 2 SLUT */

/* STARS */
// --- TOTAL STARS ---

/* function updateStars() {
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
} */
