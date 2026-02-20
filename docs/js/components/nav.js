class GameNav extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="style.css" />  
    <link rel="stylesheet" href="css/nav.css">
      


      <nav id="nav-menu" class="nav-menu-overlay">
        <div class="nav-toggle">
          <button class="nav-menu-close">
            <img class="icon_s" src="icons/nav/close.svg" alt="Stäng meny">
          </button>
        </div>

       <ul class="nav-list"> 
        <li><a class="nav-list-item" href="menu.html"><img class="nav-icon" src="icons/nav/icon_home_cream.svg" alt="" />Startsida</a></li> <li><a class="nav-list-item" href="words.html"><img class="nav-icon" src="icons/nav/icon_dictionary_cream.svg" alt="" />Ordlista</a></li> <li><a class="nav-list-item" href="settings.html"><img class="nav-icon" src="icons/nav/icon_settings_cream.svg" alt="" />Inställningar</a></li> <li><a class="nav-list-item" href="instructions.html"><img class="nav-icon" src="icons/nav/icon_instructions_cream.svg" alt="" />Spelguide</a></li> <li><a class="nav-list-item" href="about.html"><img class="nav-icon" src="icons/nav/icon_about_cream.svg" alt="" />Om memolia</a></li> </ul> 
      </nav>
    `;
  }

  connectedCallback() {
    this.menu = this.shadowRoot.getElementById("nav-menu");

    const closeBtn = this.shadowRoot.querySelector(".nav-menu-close");

    closeBtn.addEventListener("click", () => this.close());
  }

  // ⭐ detta saknades hos dig
  open() {
    this.menu.classList.add("active");
  }

  close() {
    this.menu.classList.remove("active");
  }
}

customElements.define("game-nav", GameNav);

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("game-nav");

  const toggleBtn = document.getElementById("nav-menu-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => menu.open());
  }
});
