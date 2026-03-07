class InfoDialog extends HTMLElement {
  constructor(message) {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/style.css">
      <div class="board-gap">
        <h2 class="text-headline-md">${message}</h2>
        <div class="wrapper_buttons">
          <div class="button_primary button_text clickable" id="ok">
            <span class="button_label">OK</span>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById("ok").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("close", { bubbles: true }));
    });
  }
}

customElements.define("info-dialog", InfoDialog);
