/* LANGUAGE SELECTOR */

/* 
✔ vilket språk som är valt
✔ spara språk
✔ byta språk
✔ trigga event när språk ändras
✔ flag state
✔ dropdown/popup UI

INTE INNEHÅLLA:
❌ game logic
❌ stars logic
❌ category logic
❌ board logic
❌ DOM updates för hela sidan
 */

// language-selector.js
class LanguageSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">

      <div class="board-gap">
       
          <h2 class="text-title text--size-md">Språk jag vill lära mig</h2>

          <div class="menu__list clickable">

            <div class="menu__item clickable" data-value="english" data-flag="icons/flag/english-br.svg">
              <img class="flag" src="icons/flag/english-br.svg" alt="">
              <h4 class="text-headline text--size-sm">Engelska</h4>
            </div>

            <div class="menu__item clickable" data-value="french" data-flag="icons/flag/french-fr.svg">
              <img class="flag" src="icons/flag/french-fr.svg" alt="">
              <h4 class="text-headline text--size-sm">Franska</h4>
            </div>

            <div class="menu__item clickable" data-value="portuguese-br" data-flag="icons/flag/portuguese-br.svg">
              <img class="flag" src="icons/flag/portuguese-br.svg" alt="">
              <h4 class="text-headline text--size-sm">Portugisiska (Br)</h4>
            </div>

            <div class="menu__item clickable" data-value="swedish" data-flag="icons/flag/swedish.svg">
              <img class="flag" src="icons/flag/swedish.svg" alt="">
              <h4 class="text-headline text--size-sm">Svenska</h4>
            </div>

          </div>
          </div>
     
    `;
  }

  connectedCallback() {
    this.items = this.shadowRoot.querySelectorAll(".menu__item");

    this.items.forEach((item) => {
      item.addEventListener("click", () => this.selectLanguage(item));
    });

    this.loadCurrentLanguage();
  }

  loadCurrentLanguage() {
    const lang = localStorage.getItem("language") || "english";

    this.items.forEach((item) => {
      item.classList.remove("selected-option");

      if (item.dataset.value === lang) {
        item.classList.add("selected-option");
      }
    });
  }

  selectLanguage(item) {
    const lang = item.dataset.value;
    const flag = item.dataset.flag;

    localStorage.setItem("language", lang);
    localStorage.setItem("languageFlag", flag);

    this.loadCurrentLanguage();

    this.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: {
          language: lang,
          flag: flag,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("language-selector", LanguageSelector);
