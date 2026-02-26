class HeaderDefault extends HTMLElement {
  connectedCallback() {
    const titlePrimary = this.getAttribute("title-primary") || "";

    const showMenu = this.hasAttribute("show-menu");
    const showDictionary = this.hasAttribute("show-dictionary");

    this.innerHTML = `
      <header>

        <!-- NAVBAR -->
        <nav class="navbar">
          <a class="text-effect" href="menu.html">
            <h1 class="text-display">memolia</h1>
          </a>

          <button id="nav-menu-toggle" class="clickable">
            <img
              class="hamburger-icon"
              src="icons/nav/hamburger_dots_hitbox.svg"
              alt="Öppna meny" />
          </button>
        </nav>

        <!-- PAGE LABEL -->
        <container class="container_page-label">
          <div class="wrapper_h2-text-button">
            <h2 class="text-title">${titlePrimary}</h2>
          </div>
        </container>

        <!-- TOTAL INFO -->
        <container class="container_total">

          <article class="article_game-info">
            <div class="wrapper_spel-min">

            <!-- BYTA DIV TILL BUTTON VID TILLFÄLLE -->
            <div class="icon-wrapper" aria-label="Välj språk">
              <img
                id="selected-flag"
                class="flag icon_md"
                src="icons/flag/english-br.svg"
                alt="Valt språk" />
                <span class="tooltip">Välj språk</span>
            </div>
                <popup-wrapper id="languageModal">
                  <language-selector></language-selector>
                </popup-wrapper>

              <div class="wrapper_text-min">
                <img class="star-big icon_md" src="./icons/star_5c.svg" />
                <span id="info-rounds"></span>
              </div>

            </div>
          </article>

          <div class="wrapper_buttons-round">

            ${
              showDictionary
                ? `
              <a class="icon-wrapper"
                 aria-label="Gå till ordlista"
                 href="words.html">
                <div class="hitbox icon_single">
                  <img
                    class="icon_md"
                    src="icons/nav/icon_dictionary_cream.svg"
                    alt="" />
                </div>
                <span class="tooltip">Gå till ordlista</span>
              </a>
            `
                : ""
            }

            ${
              showMenu
                ? `
              <a class="icon-wrapper"
                 aria-label="go to main menu"
                 href="menu.html">
                <div class="hitbox icon_single">
                  <img
                    class="icon_md"
                    src="icons/nav/icon_home_cream.svg"
                    alt="" />
                </div>
                <span class="tooltip">Gå till huvudmeny</span>
              </a>
            `
                : ""
            }

          </div>

        </container>

      </header>
    `;
  }
}

customElements.define("header-default", HeaderDefault);
