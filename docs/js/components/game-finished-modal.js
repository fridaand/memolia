class GameFinishedModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="popup_bg section_end-game">

        <div class="lottie-container"></div>

        <div class="container_end-game popup_styling">

          <div class="wrapper_h2-text">
            <h2 class="text-title" id="popupText">Bra gjort!</h2>

            <div class="p-gap">
              <p>
                Du klarade spelet med
                <span class="score"></span> drag på
                <span class="info-seconds"></span> sekunder
              </p>
            </div>
          </div>

          <div class="wrapper-buttons">

            <div
              class="actions button_primary button_text button_cta"
              onclick="restartGame()"
            >
              <img src="/docs/icons/buttons/play_again.svg" alt="" />
              <span class="button_label">Spela ige</span>
            </div>

            <div
              class="button_primary button_text button_warning"
              onclick="window.location.href = 'menu.html'"
            >
              <img src="/docs/icons/nav/icon_home_black.svg" alt="" />
              <span class="button_label">Huvudmeny</span>
            </div>

          </div>

        </div>

      </div>
    `;
  }
}

customElements.define("game-finished-modal", GameFinishedModal);
