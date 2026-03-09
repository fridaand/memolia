class PopupWrapper extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `

    
      <div class="overlay hidden">
        <div class="popup">
          <div class="modal-section">

              <div class="nav-toggle">
                <button class="popup-menu-close hit-box justify-end clickable">
                  <img class="icon-sm" src="icons/nav/close.svg" alt="Stäng">
                </button>
              </div>

              <div class="modal-content"></div>

          </div>
        </div>
      </div>
    `;

    this.overlay = this.querySelector(".overlay");
    this.popup = this.querySelector(".popup");
    this.content = this.querySelector(".modal-content");
    this.closeBtn = this.querySelector(".popup-menu-close");

    this.closeBtn.addEventListener("click", () => this.close());

    this.overlay.addEventListener("click", (e) => {
      if (!this.popup.contains(e.target)) this.close();
    });

    this.handleEsc = (e) => {
      if (e.key === "Escape") this.close();
    };

    document.addEventListener("keydown", this.handleEsc);

    this.addEventListener("show-confirmation", (e) => {
      this.content.innerHTML = "";
      this.content.appendChild(e.detail.content);
    });

    this.addEventListener("close-popup", () => this.close());
  }

  open(htmlContent) {
    this.content.innerHTML = "";
    this.content.appendChild(htmlContent);

    this.overlay.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  close() {
    this.overlay.classList.add("hidden");
    this.content.innerHTML = "";

    document.body.classList.remove("modal-open");
  }
}

customElements.define("popup-wrapper", PopupWrapper);
