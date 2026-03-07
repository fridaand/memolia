/* BOARD SIZE */

const boardOptions = document.querySelectorAll(".board-option");

// Funktion för att uppdatera UI
function updateBoardSelectionUI() {
  const savedBoardSize = localStorage.getItem("boardSize") || "12";

  boardOptions.forEach((option) => {
    const boardNum = option.dataset.cards;
    const img = option.querySelector("img");

    if (boardNum === savedBoardSize) {
      option.classList.add("selected");
      img.src = `icons/board/board_${boardNum}_selected.svg`;
    } else {
      option.classList.remove("selected");
      img.src = `icons/board/board_${boardNum}.svg`;
    }
  });
}

// Klickhantering
boardOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedBoard = option.dataset.cards;

    // Spara valet
    localStorage.setItem("boardSize", selectedBoard);

    // Uppdatera UI
    updateBoardSelectionUI();

    // Dispatcha event för game.js
    /*    document.dispatchEvent(new Event("boardSizeChanged")); */
    document.dispatchEvent(
      new CustomEvent("boardSizeChanged", {
        detail: { boardSize: selectedBoard },
      }),
    );
  });
});

// Initiera UI vid laddning
document.addEventListener("DOMContentLoaded", updateBoardSelectionUI);

document.addEventListener("DOMContentLoaded", () => {
  updateBoardSelectionUI(); // visar rätt knapp vid laddning
});
