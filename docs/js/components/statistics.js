/* class StatisticsModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = ` */

class StatisticsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.updateUI();

    // Uppdatera när språk ändras
    document.addEventListener("language-changed", () => {
      this.updateUI();
    });
  }

  render() {
    this.shadowRoot.innerHTML = ` 

    <link rel="stylesheet" href="css/style.css">



  <div class="board-gap">
    
      <h2 class="text-headline-md">Överblick</h2>

      <div class="menu__list clickable">

        <div class="wrapper-horizontal">
          <img id="stats-flag" class="flag" src="icons/flag/french-fr.svg" alt="">
          <h3 id="stats-language-title" class="text-headline-sm">Aktuellt språk</h3>
        </div>

        <div class="modal-list">      
            <div class="wrapper_p spacing-sm">   
                <div class="wrapper-horizontal">
                  <img class="star-bright icon_xs" src="./icons/star/star-md.svg">
                  <p class="text--color-primary">Poäng</p>   
                  <span class="text--weight-regular" id="stars-language"></span>   
              </div> 
            </div>

          <div class="wrapper_p spacing-sm">
            <div class="wrapper-horizontal">
                <img class="icon_xs" src="./icons/arrow-refresh.svg">
                <p class="text--color-primary">Spelade rundor</p>
                
            <span class="text--weight-regular" id="rounds-language"></span>
              </div>
          </div>

          <div class="wrapper_p spacing-sm">  
            <div class="wrapper-horizontal">
                <img class="icon_xs" src="./icons/clock.svg">
                <p class="text--color-primary">Total tid</p>    
                <span class="text--weight-regular" id="time-language"></span>
            </div>
          </div>  

        </div>

      </div>

    <hr class="line"/>


    <div class="menu__list clickable">
    
      <h3 class="text-headline-sm">Totalt - alla språk</h3>

        <div class="modal-list">      

          <div class="wrapper_p spacing-sm">   
              <div class="wrapper-horizontal">
                <img class="star-bright icon_xs" src="./icons/star/star-md.svg">
                <p class="text--color-primary">Poäng</p>   
                <span class="text--weight-regular" id="stars-all"></span>  
              </div>  
          </div>

          <div class="wrapper_p spacing-sm">
            <div class="wrapper-horizontal">
                <img class="icon_xs" src="./icons/arrow-refresh.svg">
                <p class="text--color-primary">Spelade rundor</p>          
                <span class="text--weight-regular" id="rounds-all"></span>
            </div>
          </div>

          <div class="wrapper_p spacing-md">        
            <div class="wrapper-horizontal">
                <img class="icon_xs" src="./icons/clock.svg">
                <p class="text--color-primary">Total tid</p>    
                <span class="text--weight-regular" id="time-all"></span>
            </div>
          </div>
    
        </div>

    <div class="menu__list clickable">


  </div>
    `;
  }

  getLanguageDisplayData(lang) {
    const languageMap = {
      english: {
        name: "Engelska",
        flag: "icons/flag/english-br.svg",
      },
      french: {
        name: "Franska",
        flag: "icons/flag/french-fr.svg",
      },
      swedish: {
        name: "Svenska",
        flag: "icons/flag/swedish.svg",
      },
      "portuguese-br": {
        name: "Portugisiska",
        flag: "icons/flag/portuguese-br.svg",
      },
    };

    return languageMap[lang] || languageMap["english"];
  }

  updateUI() {
    const lang = getCurrentLanguage();
    console.log("Current language:", lang);
    const langData = this.getLanguageDisplayData(lang);
    console.log("Language data:", langData);

    this.shadowRoot.getElementById("stats-language-title").textContent =
      langData.name;

    this.shadowRoot.getElementById("stats-flag").src = langData.flag;

    this.shadowRoot.getElementById("stars-language").textContent =
      this.getTotalStarsForLanguage(lang);

    this.shadowRoot.getElementById("stars-all").textContent =
      this.getTotalStarsAllLanguages();

    this.shadowRoot.getElementById("rounds-language").textContent =
      this.getRoundsForLanguage(lang);

    this.shadowRoot.getElementById("rounds-all").textContent =
      this.getTotalRoundsAllLanguages();

    this.shadowRoot.getElementById("time-language").textContent =
      this.formatTime(this.getTimeForLanguage(lang));

    this.shadowRoot.getElementById("time-all").textContent = this.formatTime(
      this.getTotalTimeAllLanguages(),
    );
  }

  getRoundsForLanguage(lang) {
    return parseInt(localStorage.getItem("rounds-" + lang), 10) || 0;
  }

  /*   getTotalRoundsAllLanguages() {
    let total = 0;

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("rounds-")) {
        total += parseInt(localStorage.getItem(key), 10) || 0;
      }
    });

    return total;
  } */

  getTotalRoundsAllLanguages() {
    const languages = ["english", "french", "swedish", "portuguese-br"];

    return languages.reduce((total, lang) => {
      return (
        total + (parseInt(localStorage.getItem("rounds-" + lang), 10) || 0)
      );
    }, 0);
  }

  getTimeForLanguage(lang) {
    return parseInt(localStorage.getItem("time-" + lang), 10) || 0;
  }

  getTotalTimeAllLanguages() {
    const languages = ["english", "french", "swedish", "portuguese-br"];

    return languages.reduce((total, lang) => {
      return total + (parseInt(localStorage.getItem("time-" + lang), 10) || 0);
    }, 0);
  }

  /*   getTotalTimeAllLanguages() {
    let total = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("time-") && key !== "time-all") {
        total += parseInt(localStorage.getItem(key), 10) || 0;
      }
    });
    return total;
  } */
  /* 
  getTotalStarsForLanguage(lang) {
    return parseInt(localStorage.getItem("star-" + lang), 10) || 0;
  } */

  getTotalStarsAllLanguages() {
    let total = 0;

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("stars-")) {
        total += parseInt(localStorage.getItem(key), 10) || 0;
      }
    });

    return total;
  }

  getTotalStarsForLanguage(lang) {
    let total = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("stars-") && key.endsWith("-" + lang)) {
        total += parseInt(localStorage.getItem(key), 10) || 0;
      }
    });
    return total;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

customElements.define("statistics-modal", StatisticsModal);
