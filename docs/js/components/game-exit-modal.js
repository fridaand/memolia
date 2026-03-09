class GameExitModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="popUpId" class="popup_bg">
        <div class="popup_styling">

          <div class="wrapper_justify-end">
            <div class="hitbox_tr">
              <img
                class="button_close clickable"
                src="./icons/nav/close.svg"
                alt="close dialog box to return to game"
              />
            </div>
          </div>

          <h2 class="text-title">Vill du avsluta spelet?</h2>

          <div class="wrapper-buttons">
            <a href="menu.html">
              <div class="button_primary button_text button_warning" id="goBackButton">
                <span class="button_label">Avsluta</span>
              </div>
            </a>

            <a class="button_close">
              <div class="button_primary button_text button_cta">
                <span class="button_label">Fortsätt spela</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define("game-exit-modal", GameExitModal);
