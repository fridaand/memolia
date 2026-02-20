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

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
     

<div class="overlay hidden">
  <div class="popup section_text bg_petrol3" id="language-popup">
        <div class="board">

            <div class="nav-toggle">
                <button class="popup-menu-close">
                    <img class="icon_s" src="icons/nav/close.svg" alt="Stäng meny">
                </button>
            </div>

            <h3>Språk jag vill lära mig</h3>

            <div class="menu__list clickable">
               
                <div class="menu_item_wrapper">
                  <div
                    class="menu__item selected-language"
                    data-value="english"
                    data-title="ENG"
                    data-flag="icons/flag/english-br.svg"
                    onclick="selectOption(this)"
                  >  
                   <img
                    class="flag flag-eng"
                    src="icons/flag/english-br.svg"
                    alt="choose english language" 
                  />
                    <h5>Engelska</h5>
                  </div>
                </div>

                 <div class="menu_item_wrapper">
                  <div
                    class="menu__item"
                    data-value="french"
                    data-title="FRA"
                    data-flag="icons/flag/french-fr.svg"
                    onclick="selectOption(this)"
                  >
                    <img
                    class="flag flag-fre"
                    src="icons/flag/french-fr.svg"
                    alt="choose french language"
                  />
                    <h5>Franska</h5>
                  </div>
                 </div>

                <div class="menu_item_wrapper">
                  <div
                    class="menu__item"
                    data-value="portuguese-br"
                    data-title="POR (BR)"
                    data-flag="icons/flag/portuguese-br.svg"
                    onclick="selectOption(this)"
                  >
                     <img
                    class="flag flag-por"
                    src="icons/flag/portuguese-br.svg"
                    alt="choose portuguese language"
                  />
                    <h5>Portugisiska (Br)</h5>
                  </div>
                </div>

                <div class="menu_item_wrapper">
                  <div
                    class="menu__item"
                    data-value="swedish"
                    data-title="SVE"
                    data-flag="icons/flag/swedish.svg"
                    onclick="selectOption(this)"
                  >
                     <img
                    class="flag flag-swe"
                    src="icons/flag/swedish.svg"
                    alt="choose swedish language"
                  />
                    <h5>Svenska</h5>
                  </div>
                </div>
                
            </div>
          
                
        </div>
    
    </div>
</div>
`;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "style.css";

    this.shadowRoot.append(link, wrapper);
  }

  connectedCallback() {
    this.overlay = this.shadowRoot.querySelector(".overlay");
    this.popup = this.shadowRoot.querySelector(".popup");
    this.closeBtn = this.shadowRoot.querySelector(".popup-menu-close");

    this.flagImg = document.getElementById("selected-flag");

    if (this.flagImg) {
      this.flagImg.addEventListener("click", () => this.open());
    }

    // kryss
    this.closeBtn.addEventListener("click", () => this.close());

    // klick utanför
    this.overlay.addEventListener("click", (e) => {
      if (!this.popup.contains(e.target)) {
        this.close();
      }
    });

    // ESC
    this.handleEsc = (e) => {
      if (e.key === "Escape") this.close();
    };

    document.addEventListener("keydown", this.handleEsc);

    this.loadCurrentLanguage();
  }

  loadCurrentLanguage() {
    const lang = localStorage.getItem("language") || "english";
    const selectedItem = this.shadowRoot.querySelector(
      `.menu__item[data-value="${lang}"]`,
    );

    this.shadowRoot.querySelectorAll(".menu__item").forEach((item) => {
      item.addEventListener("click", () => this.selectLanguage(item));
    });

    // markera i popup
    this.shadowRoot
      .querySelectorAll(".menu__item")
      .forEach((item) => item.classList.remove("selected-language"));
    if (selectedItem) selectedItem.classList.add("selected-language");

    // uppdatera flagga
    if (this.flagImg && selectedItem.dataset.flag) {
      this.flagImg.src = selectedItem.dataset.flag;
    }

    // uppdatera stjärnor och kategorier
    if (typeof updateStars === "function") updateStars();
    if (typeof updateAllCategories === "function") updateAllCategories(lang);
  }

  selectLanguage(item) {
    const lang = item.dataset.value;
    const flag = item.dataset.flag;

    localStorage.setItem("language", lang);
    localStorage.setItem("languageFlag", flag);

    // uppdatera popup
    this.loadCurrentLanguage();

    // stäng popup
    this.popup.classList.remove("open");
  }

  open() {
    this.overlay.classList.remove("hidden");
  }

  close() {
    this.overlay.classList.add("hidden");
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleEsc);
  }
}

// Registrera komponent
customElements.define("language-selector", LanguageSelector);

/* POPUP TOGGLE */
/* const overlay = this.shadowRoot.querySelector(".overlay"); */
/* const popup = this.shadowRoot.querySelector(".popup");
const closeBtn = this.shadowRoot.querySelector(".popup-menu-close");

// --- öppna / stäng funktioner
this.open = () => overlay.classList.remove("hidden");
this.close = () => overlay.classList.add("hidden");

// ✅ klick på kryss
closeBtn.addEventListener("click", () => this.close());

// ✅ klick utanför popup
overlay.addEventListener("click", (e) => {
  if (!popup.contains(e.target)) {
    this.close();
  }
});

// ✅ ESC tangent
this.handleEsc = (e) => {
  if (e.key === "Escape") this.close();
};

document.addEventListener("keydown", this.handleEsc); */
