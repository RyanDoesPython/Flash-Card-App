const flashCardEditorHolder = document.getElementById("flashCardEditorHolder");
const flashCardSetTitle = document.getElementById("flashCardSetTitle");
const flashCardTagDropdown = document.getElementById("flashCardTagDropdown");

class flashCard{
    constructor(term, definition, id){
        this.term = term;
        this.definition = definition;
        this.id = id;
    }
}

let selectedFlashcardSet;

editFlashCardSetButton.addEventListener("click", () => {
    const index = flashCardList.findIndex(flashCardSet => flashCardSet.id === selectedId);
    
    console.log("edit", flashCardList[index].id)
    mainMenu.style.display = "none"
    editScreen.style.display = "block"

    selectedFlashcardSet = flashCardList[index];
    populateFlashCards(selectedFlashcardSet);
})

backButton.addEventListener("click", () => {
    mainMenu.style.display = "block"
    editScreen.style.display = "none"
    studyScreen.style.display = "none";
    renderFlashCards();
})

function populateFlashCards(flashCardSet){
    flashCardSetTitle.value = flashCardSet.id;
    flashCardTagDropdown.value = flashCardSet.tag;

    flashCardEditorHolder.innerHTML = "";
    const flashCards = flashCardSet.flashCards; 

    flashCards.forEach(flashCard => {
        createFlashCardEditor(flashCard);
    });

    const addNewFlashCardButton = document.createElement('button');
    addNewFlashCardButton.classList.add("addFlashCardButton");
    addNewFlashCardButton.id = "addFlashCardButton";
    addNewFlashCardButton.textContent = "ADD CARD";

    const underline = document.createElement('hr');
    underline.classList.add('underline')

    addNewFlashCardButton.appendChild(underline)
    flashCardEditorHolder.appendChild(addNewFlashCardButton);

    // Add event listener immediately after creating the button
    addNewFlashCardButton.addEventListener("click", () => {
        addFlashCard();
    });
}

function addFlashCard(){
    // Get the ID of the last flashcard or start at 0
    let lastFlashCard = selectedFlashcardSet.flashCards[selectedFlashcardSet.flashCards.length - 1];
    let flashCardID = lastFlashCard ? lastFlashCard.id + 1 : 0;
    
    // Create a new flashcard object
    const newFlashCard = new flashCard("", "", flashCardID);
    selectedFlashcardSet.flashCards.push(newFlashCard);

    console.log(selectedFlashcardSet.flashCards);

    // Create the flashcard editor for the new flashcard
    createFlashCardEditor(newFlashCard);
    populateFlashCards(selectedFlashcardSet)
}

function createFlashCardEditor(flashCard){

    // Create the flashcard editor div
    const flashCardEditor = document.createElement("div");
    flashCardEditor.classList.add("flashCardEditor");
    flashCardEditor.id = `${flashCard.id}`;

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("headerDiv");

    // Create inner HTML elements
    const idLabel = document.createElement("p");
    idLabel.textContent = `${flashCard.id + 1}`;
    idLabel.classList.add("number")

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `
        <svg class="trashButtonSVG" width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 6H19.5" stroke-width="2" stroke-linecap="round"/>
            <path d="M8.5 6V4C8.5 3.44772 8.94772 3 9.5 3H14.5C15.0523 3 15.5 3.44772 15.5 4V6" stroke-width="2" stroke-linecap="round"/>
            <path d="M17.5 6V20C17.5 20.5523 17.0523 21 16.5 21H7.5C6.94772 21 6.5 20.5523 6.5 20V6" stroke-width="2" stroke-linecap="round"/>
            <path d="M9.5 10V16" stroke-width="2" stroke-linecap="round"/>
            <path d="M14.5 10V16" stroke-width="2" stroke-linecap="round"/>
        </svg>


    `;
    deleteButton.id = `deleteButton${flashCard.id}`;
    deleteButton.classList.add("deleteButton")
    deleteButton.addEventListener("click", () => {
        selectedFlashcardSet.flashCards = selectedFlashcardSet.flashCards.filter(fc => fc.id !== flashCard.id);
        reassignFlashCardIDs(selectedFlashcardSet.flashCards)
        populateFlashCards(selectedFlashcardSet);
        localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
    });

    const dividerLine = document.createElement("hr");
    dividerLine.classList.add("dividerLine");

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("inputDiv")

    const termInputDiv = document.createElement("div");
    termInputDiv.classList.add("termInputDiv");

    const termInput = document.createElement("input");
    termInput.value = flashCard.term;
    termInput.id = `termInput${flashCard.id}`
    termInput.classList.add("termInput");
    termInput.placeholder = "Enter Term"
    termInput.addEventListener("input", function() {
        selectedFlashcardSet.flashCards[flashCard.id].term = this.value
        localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
    });

    const definitionInputDiv = document.createElement("div");
    definitionInputDiv.classList.add("definitionInputDiv")
    const definitionInput = document.createElement("input");
    definitionInput.value = flashCard.definition;
    definitionInput.id = `definitionInput${flashCard.id}`
    definitionInput.classList.add("definitionInput")
    definitionInput.placeholder = "Enter Definition"
    definitionInput.addEventListener("input", function() {
        selectedFlashcardSet.flashCards[flashCard.id].definition = this.value;
        localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
    });

    // Append all elements to the flashCardEditor
    flashCardEditor.appendChild(headerDiv);

    headerDiv.appendChild(idLabel);
    headerDiv.appendChild(deleteButton);
    flashCardEditor.append(dividerLine);

    termInputDiv.appendChild(termInput);
    definitionInputDiv.appendChild(definitionInput);


    inputDiv.appendChild(termInputDiv);
    inputDiv.appendChild(definitionInputDiv);

    flashCardEditor.appendChild(inputDiv);

    // Append the flashCardEditor to the holder
    flashCardEditorHolder.appendChild(flashCardEditor);

    localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
}

function reassignFlashCardIDs(flashCards){
    // Sort the flashcards by their current IDs
    flashCards.sort((a, b) => a.id - b.id);

    // Reassign IDs so they are continuous starting from 0
    flashCards.forEach((flashCard, index) => {
        flashCard.id = index; // New ID will be the index
    });
}

flashCardSetTitle.addEventListener("input", function() {
    selectedFlashcardSet.id = this.value
    localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
});
flashCardTagDropdown.addEventListener("change", function() {
    selectedFlashcardSet.tag = this.value;
    localStorage.setItem('flashCardList', JSON.stringify(flashCardList));
})