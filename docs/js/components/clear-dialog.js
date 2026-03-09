class ClearDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/style.css">

      <div class="board-gap">
        <h2 class="text-headline-md text-warning">Radera allt?</h2>
        <div class="wrapper_p">
          <p>Är du säker på att du vill ta bort alla poäng och spelad tid för alla språk?</p>
          <div role="alert" class="warning">
            <p><strong>OBS!</strong> Detta kan <strong>INTE</strong> ångras.</p>
          </div>
        </div>
        <div class="wrapper-buttons">
          <div class="button_primary button_text button_warning clickable" id="confirm">
            <span class="button_label">Radera</span>
          </div>
          <div class="button_primary button_text clickable" id="cancel">
            <span class="button_label">Avbryt</span>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const confirmBtn = this.shadowRoot.getElementById("confirm");
    const cancelBtn = this.shadowRoot.getElementById("cancel");

    // AVBRYT: stäng popup-wrapper
    cancelBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("close-popup", { bubbles: true }));
    });

    // RADERA ALLT + bekräftelse-popup
    confirmBtn.addEventListener("click", () => {
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("stars-") ||
          key.startsWith("time-") ||
          key.startsWith("rounds-")
        ) {
          localStorage.removeItem(key);
        }
      });

      this.dispatchEvent(
        new CustomEvent("storage-cleared", {
          bubbles: true,
          composed: true,
        }),
      );

      this.dispatchEvent(new CustomEvent("close-popup", { bubbles: true }));

      // Skapa bekräftelse-dialog
      const confirmation = document.createElement("div");
      confirmation.classList.add("board-gap");
      confirmation.innerHTML = `


      <div class="board-gap">
          <h2 class="text-headline-md text-warning">Inställningar raderade</h2>
          <div class="wrapper_p">
            <p>Alla inställningar har raderats</p>
          </div>
        </div>
        <div class="wrapper-buttons">
          <button class="button_primary button_text button-info clickable confirm">
            <span class="button_label">Ok</span>
          </button>
        </div>
      `;

      // Dispatch event för popup-wrapper att ersätta innehållet
      this.dispatchEvent(
        new CustomEvent("show-confirmation", {
          detail: { content: confirmation },
          bubbles: true,
        }),
      );
    });
  }
}

customElements.define("clear-dialog", ClearDialog);
