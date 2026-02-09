isCardShowing = false;
isNewGame = true;
lastCard = null;
time = 0;
moves = 0;
matches = 0;
timerInterval = null;
isLocked = false;


async function loadDeck(deckId, numberOfCards = 8) {

    let cards;
    try {
        const response = await fetch(`http://localhost:3000/cards/deck/${deckId}`);
        const allCards = await response.json();
        const selectedCards = shuffle(allCards).slice(0, numberOfCards);

        // Map to your card format
        const cardArray = selectedCards.map(card => ({
            name: card.name,
            link: card.link,
            solved: false,
            flipped: false
        }));
        cards = [...cardArray, ...cardArray];
        console.log(`Loaded ${numberOfCards} cards from deck ${deckId}`);
    } catch (error) {
        console.error('Error loading deck:', error);
    }


    return shuffle(cards);
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
                <img src="${cardArray[i].link}" alt="card front">
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
                        if (matches === cards.length / 2) {
                            clearInterval(timerInterval);
                            displayWin(time, moves, matches);
                        }
                    } else {
                        moves++;
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

function displayWin(time, moves, matches) {
    const popup = document.getElementById('win-popup');
    const score = document.getElementById('score');
    popup.classList.toggle('show');
    score.innerHTML = `Score: ${calculateScore(time, moves, matches)}`
}

function calculateScore(time, moves, matches) {
    return (matches * 100) - (time * 2) - (moves * 5)
}

function startNewGame() {
    const popupText = document.getElementById('win-popup');
    popupText.classList.remove('show');

    setTimeout(() => {
        document.getElementById('game-grid').innerHTML = '';
        populateCardGrid(loadDeck(16, 1));
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

populateCardGrid(loadDeck(1, 16));