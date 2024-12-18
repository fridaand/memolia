// hamburger.js

async function loadHamburgerMenu() {
  try {
    const response = await fetch("hamburger.html"); // Ladda in HTML-innehåll
    const menuHTML = await response.text();
    document.getElementById("menu-placeholder").innerHTML = menuHTML;
    initializeHamburgerMenu();
  } catch (error) {
    console.error("Kunde inte ladda hamburgermenyn:", error);
  }
}

function initializeHamburgerMenu() {
  const toggleButton = document.getElementById("hamburger-toggle");
  const menuItems = document.getElementById("hamburger-items");

  if (toggleButton && menuItems) {
    toggleButton.addEventListener("click", () => {
      const expanded = toggleButton.getAttribute("aria-expanded") === "true";
      toggleButton.setAttribute("aria-expanded", !expanded);
      menuItems.classList.toggle("show"); // Visa eller dölj menyn
    });
  }
}

// Kör funktionen när sidan laddas
document.addEventListener("DOMContentLoaded", loadHamburgerMenu);
