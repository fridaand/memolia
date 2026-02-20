/* BOARD SIZE */

/* const boardSize = localStorage.getItem("boardSize") || "12"; // default
 */
const boardOptions = document.querySelectorAll(".board-option");

boardOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedBoard = option.dataset.value;

    // Spara valet
    localStorage.setItem("boardSize", selectedBoard);

    // Dispatcha ett custom event som game.js kan lyssna på
    document.dispatchEvent(new Event("boardSizeChanged"));

    // Markera visuellt
    boardOptions.forEach((o) => o.classList.remove("selected"));
    option.classList.add("selected");

    // Byt ut bilder
    boardOptions.forEach((o) => {
      const boardNum = o.dataset.value;
      const img = o.querySelector("img");

      if (o.classList.contains("selected")) {
        img.src = `icons/board/board_${boardNum}_selected.svg`; // den valda bilden
      } else {
        img.src = `icons/board/board_${boardNum}.svg`; // standardbild
      }
    });
  });
});
