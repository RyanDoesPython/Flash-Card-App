let selectedId;
let flashCardList = []

const tagDropdown = document.getElementById("dropdown");

class flashCardSet{
    constructor(id, tag, flashCards){
        this.id = id;
        this.tag = tag;
        
        this.flashCards = this.flashCards || [];
    }
}
// Function to fetch and insert SVG into a specified element
function loadSVG(svgPath, targetElement) {
    fetch(svgPath)
      .then(response => response.text())
      .then(svg => {
        targetElement.innerHTML = svg;  // Insert the SVG into the target element
      })
      .catch(error => console.error("Error loading SVG:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    flashCardList = (JSON.parse(localStorage.getItem('flashCardList'))) || [] 
    renderFlashCards();
})


newSetButton.addEventListener("click", () => {
    const isHidden = getComputedStyle(newSetInfo).display === "none";
    newSetInfo.style.display = isHidden ? "flex" : "none";
});

createSetButton.addEventListener("click", () => {
    newSetInfo.style.display = "none"
    
    flashCardList.push(new flashCardSet(setNameInput.value, tagDropdown.value));
    localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
    renderFlashCards();
})

flashCardSetHolder.addEventListener("contextmenu", function(event) {
    if (event.target.closest(".flashCardSet")) { 
        event.preventDefault();

        const selectedCard = event.target.closest(".flashCardSet")
        selectedId = selectedCard.id;

        // Get the clicked card's position
        const rect = selectedCard.getBoundingClientRect();

        // Position editHolder next to the clicked card, accounting for scrolling
        editFlashCardSetDiv.style.position = "absolute"; // Ensure positioning is enabled
        editFlashCardSetDiv.style.left = `${rect.left + window.scrollX}px`; // Account for horizontal scroll
        editFlashCardSetDiv.style.top = `${rect.bottom + window.scrollY + 10}px`; // Account for vertical scroll
        editFlashCardSetDiv.style.display = "flex";
    }
});

cancelCreateSetButton.addEventListener("click", () => {
    newSetInfo.style.display = "none";
})

document.addEventListener("click", function(event) {
    editFlashCardSetDiv.style.display = "none";
});

function renderFlashCards() {
    flashCardSetHolder.innerHTML = ""; // Clear the container

    flashCardList.forEach(flashCardSet => {
        const setCard = document.createElement('div');
        setCard.classList.add("flashCardSet"); // Add class for styling
        setCard.id = flashCardSet.id; // Set the ID of the card

        const deckTitle = document.createElement('p');
        deckTitle.classList.add("deckTitle");
        deckTitle.textContent = flashCardSet.id; // Set the text for the deck title

        const svgElement = document.createElement('svg'); // Create an <svg> element
        svgElement.classList.add("svg-icon"); // Add a class for styling

        // Append elements in the correct order
        setCard.appendChild(svgElement); // Add the <svg> to the setCard
        setCard.appendChild(deckTitle); // Add the title after the <svg>

        flashCardSetHolder.appendChild(setCard); // Append the setCard to the flashCardSetHolder

        // Load the SVG into the <svg> element
        loadSVG(`${flashCardSet.tag}.svg`, svgElement);
    });
}

// Update delete logic
deleteFlashCardSetButton.addEventListener("click", () => {
    const index = flashCardList.findIndex(flashCardSet => flashCardSet.id === selectedId);
    
    if (index !== -1) {
        flashCardList.splice(index, 1); // Remove from array
        localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
        renderFlashCards(); // Re-render
    }
});





