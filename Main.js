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
        targetElement.innerHTML = svg;
      })
      .catch(error => console.error("Error loading SVG:", error));
}

// Code called when page is first loaded
document.addEventListener("DOMContentLoaded", () => {
    // attempts too retrieve previously saved flashCardList from local storage, otherwise sets flashCardList to an empty arry
    flashCardList = (JSON.parse(localStorage.getItem('flashCardList'))) || [] 
    renderFlashCards();
})

// Shows/Hides the set creation menu when New Set button is clicked
newSetButton.addEventListener("click", () => {
    const isHidden = getComputedStyle(newSetInfo).display === "none";
    newSetInfo.style.display = isHidden ? "flex" : "none";
});

// Creates a nwe flashCard Set when clickeed
createSetButton.addEventListener("click", () => {
    newSetInfo.style.display = "none"
    
    // Pushes a new flashCardSet object with the parameters in the create menu too the flashCardList
    flashCardList.push(new flashCardSet(setNameInput.value, tagDropdown.value));
    //Stores the new information
    localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
    // Re-renders the main menu with the new flashCardList information
    renderFlashCards();
})

// Displays the edit/delete cardSet option when a flashCardSet is right clicked
flashCardSetHolder.addEventListener("contextmenu", function(event) {
    if (event.target.closest(".flashCardSet")) { 
        event.preventDefault(); // Prevents the usual context menu from popping up

        const selectedCard = event.target.closest(".flashCardSet")
        selectedId = selectedCard.id;

        // Get the clicked card's position
        const rect = selectedCard.getBoundingClientRect();

        // Position edit/delete options to be under the selected card
        editFlashCardSetDiv.style.position = "absolute"; // Ensure positioning is enabled
        editFlashCardSetDiv.style.left = `${rect.left + window.scrollX}px`; // Account for horizontal scroll
        editFlashCardSetDiv.style.top = `${rect.bottom + window.scrollY + 10}px`; // Account for vertical scroll
        editFlashCardSetDiv.style.display = "flex";
    }
});

// Hides the create set menu when cancel button is clicked
cancelCreateSetButton.addEventListener("click", () => {
    newSetInfo.style.display = "none";
})

// Hides the edit/delete cardSet option whenever ANY click is made in the website
document.addEventListener("click", function(event) {
    editFlashCardSetDiv.style.display = "none";
});

// Loads the main menu with the information found in the flashCardList
function renderFlashCards() {
    flashCardSetHolder.innerHTML = ""; // Clear the container

    flashCardList.forEach(flashCardSet => { // For each flashCardSet in the flashCarList creates a flashCardHolder
        const setCard = document.createElement('div');
        setCard.classList.add("flashCardSet");
        setCard.id = flashCardSet.id;

        const deckTitle = document.createElement('p');
        deckTitle.classList.add("deckTitle");
        deckTitle.textContent = flashCardSet.id;

        const svgElement = document.createElement('svg');
        svgElement.classList.add("svg-icon");

        // Append elements in the correct order
        setCard.appendChild(svgElement); // Add the <svg> to the setCard
        setCard.appendChild(deckTitle); // Add the title after the <svg>

        flashCardSetHolder.appendChild(setCard); // Append the setCard to the flashCardSetHolder

        // Load the SVG into the <svg> element
        loadSVG(`${flashCardSet.tag}.svg`, svgElement);
    });
}

// Deletes selected flashCardSet when delete button is clicked
deleteFlashCardSetButton.addEventListener("click", () => {
    const index = flashCardList.findIndex(flashCardSet => flashCardSet.id === selectedId);
    
    if (index !== -1) {
        flashCardList.splice(index, 1); // Removes flashCardSet from flashCardList
        localStorage.setItem('flashCardList', JSON.stringify(flashCardList)); // Resets the local storage with new information
        renderFlashCards(); // Re-render
    }
});

// whenever the sortOptions is changes, call the sortFlashCardList function with the value of sortOption
sortOptions.addEventListener("input", function(){
    sortFlashCardList(sortOptions.value)
})

// sorts the flashCardList and re-renders the flashCards based on a given parameter
function sortFlashCardList(sortType){
    if(sortType === "A-Z"){ // Sorts the flashCardList alphabetically
        flashCardList.sort((a, b) => a.id.localeCompare(b.id));
    }else if(sortType === "Z-A"){ // Sorts the flashCardList reverse alphabetically
        flashCardList.sort((a, b) => b.id.localeCompare(a.id));
    }else if(sortType === "type"){ // Sorts the flashCardList based on its tag
        flashCardList.sort((a, b) => a.tag.localeCompare(b.tag));
    }else if(sortType === "length"){
        flashCardList.sort((a, b) => b.flashCards.length - a.flashCards.length);
    }
    renderFlashCards()
}