let openFlashcardSet;
const studySetTitle = document.getElementById("studySetTitle");
const flashCardDisplay = document.getElementById("flashCard");
const wrongButton = document.getElementById("wrongButton");
const correctButton = document.getElementById("correctButton");
const stillLearningCounterText = document.getElementById("stillLearningCounterText");
const knowCounterText = document.getElementById("knowCounterText");
const flashCardText = document.getElementById("flashCardText");
const mainDiv = document.getElementById("mainDiv");
const resDiv = document.getElementById("resDiv");
const reviewButton = document.getElementById("reviewButton");
const studyScreenBackButton = document.getElementById("studyScreenBackButton");
const flashCardSetHolder = document.getElementById("flashCardSetHolder");
const correctAnswersProgress = document.getElementById("correctAnswersProgress");
const wrongAnswersProgress = document.getElementById("wrongAnswersProgress");
const correctAnswersProgressText = document.getElementById("correctAnswersProgressText");
const wrongAnswersProgressText = document.getElementById("wrongAnswersProgressText");
const correctAnswersDiv = document.getElementById("correctAnswers");
const wrongAnswersDiv = document.getElementById("wrongAnswers");

let wrongAnswers = 0;
let correctAnswers = 0;
let termBeingDisplayed = true;
let wrongAnswerList = [];
let tempWrongAnswerList = [];
let inReviewMode = false;
let currentCardNumber = 0;

flashCardSetHolder.addEventListener("click", function(event) {
    const clickedSet = event.target.closest(".flashCardSet");
    if (clickedSet) { 
        const id = clickedSet.id;
        mainDiv.style.display = "block";
        resDiv.style.display = "none";

        openFlashcardSet = flashCardList.find(set => set.id === id);

        if (openFlashcardSet && openFlashcardSet.flashCards.length > 0) {
            mainMenu.style.display = "none";
            editScreen.style.display = "none";
            studyScreen.style.display = "flex";
            inReviewMode = false;

            correctAnswersDiv.style.display = "block"
            wrongAnswersDiv.style.display = "block"

            // Reset counters
            knowCounterText.innerHTML = 0;
            stillLearningCounterText.innerHTML = 0;
            currentCardNumber = 0;
            wrongAnswers = 0;
            correctAnswers = 0;
            wrongAnswerList = [];
            tempWrongAnswerList = [];

            studySetTitle.innerHTML = `${openFlashcardSet.id}`;
            displayCard(openFlashcardSet.flashCards);
        }
    }
});

studyScreenBackButton.addEventListener("click", () => {
    mainMenu.style.display = "block";
    editScreen.style.display = "none";
    studyScreen.style.display = "none";
});



flashCardDisplay.addEventListener("click", () => {
    if (openFlashcardSet && openFlashcardSet.flashCards[currentCardNumber]) {
        flip();
    }
});

wrongButton.addEventListener("click", () => {
    if (!openFlashcardSet || !openFlashcardSet.flashCards[currentCardNumber]) return;

    wrongAnswers++;
    tempWrongAnswerList.push(inReviewMode ? wrongAnswerList[currentCardNumber] : openFlashcardSet.flashCards[currentCardNumber]);
    currentCardNumber++;

    stillLearningCounterText.innerHTML = wrongAnswers;
    displayCard(inReviewMode ? wrongAnswerList : openFlashcardSet.flashCards);
});

correctButton.addEventListener("click", () => {
    if (!openFlashcardSet || !openFlashcardSet.flashCards[currentCardNumber]) return;

    correctAnswers++;
    currentCardNumber++;

    knowCounterText.innerHTML = correctAnswers;
    displayCard(inReviewMode ? wrongAnswerList : openFlashcardSet.flashCards);
});

function displayCard(flashCards) {
    if (currentCardNumber >= flashCards.length) {
        mainDiv.style.display = "none";
        resDiv.style.display = "flex";

        if(wrongAnswers < 1){
            reviewButton.style.display = "none"
        }else{
            reviewButton.style.display = "flex"
        }

        const questionSetLength = inReviewMode ? wrongAnswerList.length : openFlashcardSet.flashCards.length
        const percentageRight = (correctAnswers / questionSetLength) * 100
        const percentageWrong = (wrongAnswers / questionSetLength) * 100
        correctAnswersProgress.style.width = `${percentageRight}%`
        wrongAnswersProgress.style.width = `${percentageWrong}%`

        correctAnswersProgressText.innerHTML = `${correctAnswers}/${inReviewMode ? wrongAnswerList.length : openFlashcardSet.flashCards.length}`
        wrongAnswersProgressText.innerHTML = `${wrongAnswers}/${inReviewMode ? wrongAnswerList.length : openFlashcardSet.flashCards.length}`

        if(correctAnswers == 0){
            correctAnswersDiv.style.display = "none";
        }
        if(wrongAnswers == 0){
            wrongAnswersDiv.style.display = "none"
        }

    } else {
        flashCardText.innerHTML = flashCards[currentCardNumber]?.term || "No cards left";
        termBeingDisplayed = true;;
    }
}

function flip() {
    const currentCard = openFlashcardSet.flashCards[currentCardNumber];
    flashCardText.innerHTML = termBeingDisplayed ? currentCard.definition : currentCard.term;
    termBeingDisplayed = !termBeingDisplayed;
}

reviewButton.addEventListener("click", () => {
    wrongAnswerList = tempWrongAnswerList;
    tempWrongAnswerList = [];
    if (wrongAnswerList.length > 0) {
        mainDiv.style.display = "block";
        resDiv.style.display = "none";

        // Reset for review mode
        knowCounterText.innerHTML = 0;
        stillLearningCounterText.innerHTML = 0;
        currentCardNumber = 0;
        wrongAnswers = 0;
        correctAnswers = 0;
        inReviewMode = true;

        correctAnswersDiv.style.display = "block"
        wrongAnswersDiv.style.display = "block"

        studySetTitle.innerHTML = `Review`;
        displayCard(wrongAnswerList);
    }
});
