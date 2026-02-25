/* // popup-wrapper.js
class PopupWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css">

      <div class="overlay hidden">
        <div class="popup section_text bg_petrol3">
          
          <div class="nav-toggle">
            <button class="popup-close clickable" aria-label="Stäng popup">
              <img class="icon-sm" src="icons/nav/close.svg" alt="">
            </button>
          </div>

          <div class="popup-content">
            <slot></slot>
          </div>

        </div>
      </div>
    `;

    this.overlay = this.shadowRoot.querySelector(".overlay");
    this.popup = this.shadowRoot.querySelector(".popup");
    this.closeBtn = this.shadowRoot.querySelector(".popup-close");
  }

  connectedCallback() {
    this.closeBtn.addEventListener("click", () => this.close());

    this.overlay.addEventListener("click", (e) => {
      if (!this.popup.contains(e.target)) {
        this.close();
      }
    });

    this.handleEsc = (e) => {
      if (e.key === "Escape") this.close();
    };

    document.addEventListener("keydown", this.handleEsc);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleEsc);
  }

  open() {
    this.overlay.classList.remove("hidden");
  }

  close() {
    this.overlay.classList.add("hidden");
  }
}

customElements.define("popup-wrapper", PopupWrapper);
 */

// popup-wrapper.js
class PopupWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="style.css" />


        
    <div class="overlay hidden">
        <div class="popup">
            <section class="section_text">

                <div class="board">

                    <div class="nav-toggle">
                        <button class="popup-menu-close position-bottom clickable">
                            <img class="icon-sm" src="icons/nav/close.svg" alt="Stäng meny">
                        </button>
                    </div>

                    <slot></slot>
                </div>
            </section>

        </div>
    </div>
    `;
  }

  connectedCallback() {
    this.overlay = this.shadowRoot.querySelector(".overlay");
    this.popup = this.shadowRoot.querySelector(".popup");
    this.closeBtn = this.shadowRoot.querySelector(".nav-toggle");

    this.closeBtn.addEventListener("click", () => this.close());

    this.overlay.addEventListener("click", (e) => {
      if (!this.popup.contains(e.target)) this.close();
    });

    this.handleEsc = (e) => {
      if (e.key === "Escape") this.close();
    };

    document.addEventListener("keydown", this.handleEsc);
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

customElements.define("popup-wrapper", PopupWrapper);
