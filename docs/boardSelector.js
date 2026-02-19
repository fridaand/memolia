const boardSelector = document.getElementById("board-selector");

if (boardSelector) {
  const boardOptions = boardSelector.querySelectorAll(".board-option");

  // Hämta sparad boardSize, annars default 12
  let savedBoardSize = parseInt(localStorage.getItem("boardSize")) || 12;

  boardOptions.forEach((option) => {
    const boardNum = parseInt(option.dataset.value);

    // Markera sparad boardSize visuellt
    const img = option.querySelector("img");
    if (boardNum === savedBoardSize) {
      option.classList.add("selected");
      if (option.dataset.imgSelected) img.src = option.dataset.imgSelected;
    }

    // Klick-event
    option.addEventListener("click", () => {
      savedBoardSize = boardNum;
      localStorage.setItem("boardSize", savedBoardSize);

      // Markera visuellt och uppdatera bilder
      boardOptions.forEach((o) => {
        const oImg = o.querySelector("img");
        if (o === option) {
          o.classList.add("selected");
          if (o.dataset.imgSelected) oImg.src = o.dataset.imgSelected;
        } else {
          o.classList.remove("selected");
          if (o.dataset.img) oImg.src = o.dataset.img;
        }
      });

      // Skicka CustomEvent till game.js
      const event = new CustomEvent("boardSizeChanged", {
        detail: { boardSize: savedBoardSize },
      });
      document.dispatchEvent(event);
    });
  });
}
