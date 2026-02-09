cards = createCardArray(8);
isCardShowing = false;
isNewGame = true;
lastCard = null;
time = 0;
moves = 0;
matches = 0;
timerInterval = null;
isLocked = false;


function createCardArray(targetLength) {
    const cardNames = ["boomerang", "comb", "feline", "hearts", "leaf", "spades", "star", "wing"];
    const cardArray = [];
    for (let i = 0; i < targetLength; i++) {
        cardArray.push({
            name: cardNames[i],
            id: i + 1,
            location: `images/${cardNames[i]}.png`,
            solved: false,
            flipped: false
        })
    }

    return cardArray;
}

// creates a doubled and shuffled copy of the hard-coded cards array above;
function initialiseCardArray(cards) {
    // double card array so that each card appears twice;
    const cardsCopy = cards.map(card => ({ ...card }));
    const newArray = cards.concat(cardsCopy);
    // shuffle and return;
    const cardArray = shuffle(newArray);
    return cardArray;
}

// Fisher-Yates sorting algorithm;
function shuffle(array) {
    // iterate through the array backwards;
    for (let i = array.length - 1; i > 0; i--) {
        // generate a random index that is lower than i;
        const j = Math.floor(Math.random() * (i + 1));
        // swap the elements at i & j;
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// uses DOM manipulation to populate card grid html element with flippable card divs;
function populateCardGrid(cardArray) {
    const cardGrid = document.getElementById('game-grid');

    for (let i = 0; i < cardArray.length; i++) {
        const markup = `
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-back">
                <img src="images/back.png" alt="card back">
            </div>
            <div class="flip-card-front">
                <img src="${cardArray[i].location}" alt="card front">
            </div>
        </div>
    </div>`;
        cardGrid.innerHTML += markup;
    }

    // Attach card data after DOM elements are created
    const cards = document.querySelectorAll('.flip-card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].cardData = cardArray[i];
    }

    attachCardListeners();
}

function attachCardListeners() {
    const cards = document.querySelectorAll('.flip-card');

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        card.addEventListener('click', () => {
            // check if game is locked before processing any input;
            if (isLocked) {
                return;
            }

            if (isNewGame) {
                isNewGame = false;
                timerInterval = setInterval(() => {
                    time++;
                    updateTimer(time);
                }, 1000);
            }
            // check if card is already face up and do nothing if it is;
            if (card.cardData.flipped === true) {
                console.log("revealed card clicked")

                // if card is face down go to main UI control flow;
            } else {
                // if there are no cards showing;
                if (!isCardShowing) {
                    // update boolean to track that a card is revealed;
                    isCardShowing = true;
                    // update number to store the index of this card;
                    lastCard = i;
                    // update flipped state on the DOM card;
                    card.cardData.flipped = true;
                } else {
                    // check if the current card and the last card have the same id;
                    if (card.cardData.id === cards[lastCard].cardData.id) {
                        // update the solved state on both DOM card;
                        card.cardData.solved = true;
                        cards[lastCard].cardData.solved = true;
                        fadeOutCard(card.cardData.id);
                        matches++;
                        if (matches === cards.length) {
                            displayWin();
                        }
                        console.log(`matches: ${matches}`);
                    } else {
                        moves++;
                        console.log(`moves: ${moves}`)
                    }
                    // update boolean to track that no card is revealed;
                    isCardShowing = false;
                    // call function to reset flipped cards;
                    resetCards();
                    // reset last card to null state;
                    lastCard = null;
                    // update boolean to track that card is face up;
                    card.cardData.flipped = true;
                    updateCounters(moves, matches);
                }
                // reveal the card by toggling the flipped CSS class;
                card.classList.toggle('flipped');
            }
        });
    }
}

function fadeOutCard(id) {
    const cards = document.querySelectorAll('.flip-card');

    // set a 1.5 second timer before calling the main function logic
    setTimeout(() => {
        // iterate through all DOM cards
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.cardData.id === id) {
                card.classList.toggle('solved');
            }
        }
        // time out length in milliseconds
    }, 1500);
}

function resetCards() {
    const cards = document.querySelectorAll('.flip-card');
    // lock input at start of reset;
    isLocked = true;

    setTimeout(() => {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.cardData.flipped === true && card.cardData.solved === false) {
                card.classList.toggle('flipped');
                card.cardData.flipped = false;
            }
        }
        // unlock input after reset completes;
        isLocked = false;
    }, 1500);
}

function resetAllCards() {
    const cards = document.querySelectorAll('.flip-card');
    // iterate through all DOM cards
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        // check that the card is face up
        if (card.cardData.flipped === true) {
            // flip the card face down
            card.classList.toggle('flipped');
            // update boolean to track that card is face down
            card.cardData.flipped = false;
        }
    }
}

function updateCounters(moves, matches) {
    const movesDOM = document.getElementById('moves');
    movesDOM.innerHTML = `${moves}`;
    const matchesDOM = document.getElementById('matches');
    matchesDOM.innerHTML = `${matches}`;
}

function updateTimer(time) {
    const timer = document.getElementById('timer');
    let minutes = String(Math.floor(time / 60)).padStart(2, '0');
    let seconds = String(time % 60).padStart(2, '0');
    timer.innerHTML = `${minutes}:${seconds}`;
}

function displayWin() {
    const popup = document.getElementById('win-popup');
    popup.classList.toggle('show');
}

function startNewGame() {
    const popupText = document.getElementById('win-popup');
    popupText.classList.remove('show');

    setTimeout(() => {
        document.getElementById('game-grid').innerHTML = '';
        cards = createCardArray(8);
        populateCardGrid(initialiseCardArray(cards));
        isCardShowing = false;
        isNewGame = true;
        lastCard = null;
        time = 0;
        moves = 0;
        matches = 0;
        updateCounters(moves, matches);
        updateTimer(time);
        if (timerInterval) {
            clearInterval(timerInterval);
            resetAllCards();
            timerInterval = null;
        }
    }, 800);
}

populateCardGrid(initialiseCardArray(cards));