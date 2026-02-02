let cards = [
    {
        name: "boomerang",
        id: 1,
        location: "images/boomerang.png",
        solved: false,
        flipped: false
    },
    {
        name: "comb",
        id: 2,
        location: "images/comb.png",
        solved: false,
        flipped: false
    },
    {
        name: "feline",
        id: 3,
        location: "images/feline.png",
        solved: false,
        flipped: false
    },
    {
        name: "hearts",
        id: 4,
        location: "images/hearts.png",
        solved: false,
        flipped: false
    },
    {
        name: "leaf",
        id: 5,
        location: "images/leaf.png",
        solved: false,
        flipped: false
    },
    {
        name: "spades",
        id: 6,
        location: "images/spades.png",
        solved: false,
        flipped: false
    },
    {
        name: "star",
        id: 7,
        location: "./images/star.png",
        solved: false,
        flipped: false
    },
    {
        name: "wing",
        id: 8,
        location: "images/wing.png",
        solved: false,
        flipped: false
    },
];

let cardsShowing = false;
let lastCard = null;
let moves = 0;
let matches = 0;
let newGame = true;
let time = 0;


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

// creates a doubled and shuffled copy of the hard-coded cards array above;
function initialiseCardArray(cards) {
    // double card array so that each card appears twice;
    cardsCopy = cards.map(card => ({ ...card }));
    const newArray = cards.concat(cardsCopy);
    // shuffle and return;
    const cardArray = shuffle(newArray);
    return cardArray;
}

// uses DOM manipulation to populate card grid html element with flippable card divs;
function populateCardGrid(cardArray) {
    // select game grid DOM element;
    const cardGrid = document.getElementById('game-grid');
    // loop through game grid DOM element and add HTML using the innerHTML property;
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

    // add card data from array to DOM elements inside the cardData property
    const domCards = document.querySelectorAll('.flip-card');
    for (let i = 0; i < domCards.length; i++) {
        domCards[i].cardData = cardArray[i];
    }
}

function attachCardListeners() {
    const cards = document.querySelectorAll('.flip-card');

    // iterate through array of DOM cards;
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        // add event listeners to DOM cards to control UI input logic;
        card.addEventListener('click', function () {
            if (newGame) {
                newGame = false;
                setInterval(() => {
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
                if (!cardsShowing) {
                    // update boolean to track that a card is revealed;
                    cardsShowing = true;
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
                        matches++;
                        console.log(`matches: ${matches}`);
                    } else {
                        moves++;
                        console.log(`moves: ${moves}`)
                    }
                    // update boolean to track that no card is revealed;
                    cardsShowing = false;
                    // call function to reset flipped cards;
                    resetCards();
                    // reset last card to null state;
                    lastCard = null;
                    // update boolean to track that card is face up;
                    card.cardData.flipped = true;
                    updateCounters(moves, matches);
                }
                // reveal the card by toggling the flipped CSS class;
                this.classList.toggle('flipped');
            }
        });
    }
}

function resetCards() {
    const cards = document.querySelectorAll('.flip-card');

    // set a 1.5 second timer before calling the main function logic
    setTimeout(() => {
        // iterate through all DOM cards
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            // check that card is face up and that it has not been solved
            if (card.cardData.flipped === true && card.cardData.solved === false) {
                // flip the card face down
                card.classList.toggle('flipped');
                // update boolean to track that card is face down
                card.cardData.flipped = false;
            }
        }
        // time out length in milliseconds
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