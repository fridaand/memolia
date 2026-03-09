// clear-storage-modal.js
class ClearStorageModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/style.css">

      <div class="wrapper_justify-end">
        <div class="hitbox_tl clickable close">
          <img class="button_close" src="./icons/nav/close.svg">
        </div>
      </div>

      <div class="wrapper_h2-text">
          <div class="wrapper_text">
          <p>Alla poäng och spelad tid har raderats</p>
        </div>
      </div>

      <div class="wrapper-buttons">
        <button class="button button--rect-lg button--full button--primary clickable confirm">
          <span class="button_label">Ok</span>
        </button>
      </div>
    `;
  }

  connectedCallback() {
    const confirmBtn = this.shadowRoot.querySelector(".confirm");
    const closeBtn = this.shadowRoot.querySelector(".close");

    confirmBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("close-modal", { bubbles: true }));
    });

    closeBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("close-modal", { bubbles: true }));
    });
  }
}

customElements.define("clear-storage-modal", ClearStorageModal);
