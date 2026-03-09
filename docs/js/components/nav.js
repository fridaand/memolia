class GameNav extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="css/style.css"> 

    <style>.nav-list-item:hover {
      background: var(--green-400);
      color: var(--color-text-muted);
    }
          .nav-toggle {
      position: relative;
      bottom: 1rem;
      justify-content: end;
      width: 100%;
      display: inline-flex;
    }
      .hit-box {
      display: flex;
      min-width: var(--hit-box);
      min-height: var(--hit-box);
      width: auto;
      align-items: center;
      cursor: pointer;
    }
      .nav-menu-overlay {
      padding: 3rem 1rem;
      }
    </style>
      



      <nav id="nav-menu" class="nav-menu-overlay" aria-label="Meny med länkar till sidor">

        <div class="nav-toggle">
        <div class="hit-box justify-end">
          <button class="nav-menu-close clickable" aria-label="Stäng meny">
            <img class="icon-sm" src="icons/nav/close.svg" alt="">
          </button>
        </div>
        </div>

         

       <ul class="nav-list"> 
        <li><a class="nav-list-item" href="menu.html">
        <img class="nav-icon" src="icons/nav/icon_home_cream.svg" alt="" />Startsida</a>
        </li> 

        <li><a class="nav-list-item" href="words.html">
        <img class="nav-icon" src="icons/nav/icon_dictionary_cream.svg" alt="" />Ordlista</a>
        </li> 

        <li><a class="nav-list-item" href="settings.html">
        <img class="nav-icon" src="icons/nav/icon_settings_cream.svg" alt="" />Inställningar</a>
        </li> 

        <li><a class="nav-list-item" href="instructions.html">
        <img class="nav-icon" src="icons/nav/icon_instructions_cream.svg" alt="" />Spelguide</a>
        </li> 

        <li><a class="nav-list-item" href="about.html">
        <img class="nav-icon" src="icons/nav/icon_about_cream.svg" alt="" />Om memolia</a>
        </li> 

        </ul> 
      </nav>
    `;
  }

  connectedCallback() {
    this.menu = this.shadowRoot.getElementById("nav-menu");

    const closeBtn = this.shadowRoot.querySelector(".nav-menu-close");

    closeBtn.addEventListener("click", () => this.close());
  }

  open() {
    this.menu.classList.add("active");
    const links = this.shadowRoot.querySelectorAll(".nav-list-item");
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    links.forEach((link) => {
      const linkPage = link.getAttribute("href");

      if (linkPage === currentPage) {
        link.classList.add("selected-option");
        link.setAttribute("aria-current", "page");
      }
    });
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
