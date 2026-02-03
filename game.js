export default class Game {
    constructor(totalCards) {
        this.cards = this.createCardArray(totalCards);
        this.isCardShowing = false;
        this.isNewGame = true;
        this.lastCard = null;
        this.time = 0;
        this.moves = 0;
        this.matches = 0;
        this.timerInterval = null;
    }

    createCardArray(targetLength) {
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
    initialiseCardArray(cards) {
        // double card array so that each card appears twice;
        const cardsCopy = cards.map(card => ({ ...card }));
        const newArray = cards.concat(cardsCopy);
        // shuffle and return;
        const cardArray = this.shuffle(newArray);
        return cardArray;
    }

    // Fisher-Yates sorting algorithm;
    shuffle(array) {
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
    populateCardGrid(cardArray) {
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

        this.attachCardListeners();
    }

    attachCardListeners() {
        const cards = document.querySelectorAll('.flip-card');

        // iterate through array of DOM cards;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            // add event listeners to DOM cards to control UI input logic;
            card.addEventListener('click', () => {
                if (this.isNewGame) {
                    this.isNewGame = false;
                    this.timerInterval = setInterval(() => {
                        this.time++;
                        this.updateTimer(this.time);
                    }, 1000);
                }
                // check if card is already face up and do nothing if it is;
                if (card.cardData.flipped === true) {
                    console.log("revealed card clicked")

                    // if card is face down go to main UI control flow;
                } else {
                    // if there are no cards showing;
                    if (!this.isCardShowing) {
                        // update boolean to track that a card is revealed;
                        this.isCardShowing = true;
                        // update number to store the index of this card;
                        this.lastCard = i;
                        // update flipped state on the DOM card;
                        card.cardData.flipped = true;
                    } else {
                        // check if the current card and the last card have the same id;
                        if (card.cardData.id === cards[this.lastCard].cardData.id) {
                            // update the solved state on both DOM card;
                            card.cardData.solved = true;
                            cards[this.lastCard].cardData.solved = true;
                            this.fadeOutCard(card.cardData.id);
                            this.matches++;
                            console.log(`matches: ${this.matches}`);
                        } else {
                            this.moves++;
                            console.log(`moves: ${this.moves}`)
                        }
                        // update boolean to track that no card is revealed;
                        this.isCardShowing = false;
                        // call function to reset flipped cards;
                        this.resetCards();
                        // reset last card to null state;
                        this.lastCard = null;
                        // update boolean to track that card is face up;
                        card.cardData.flipped = true;
                        this.updateCounters(this.moves, this.matches);
                    }
                    // reveal the card by toggling the flipped CSS class;
                    card.classList.toggle('flipped');
                }
            });
        }
    }

    fadeOutCard(id) {
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

    resetCards() {
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

    resetAllCards() {
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

    updateCounters(moves, matches) {
        const movesDOM = document.getElementById('moves');
        movesDOM.innerHTML = `${moves}`;
        const matchesDOM = document.getElementById('matches');
        matchesDOM.innerHTML = `${matches}`;
    }

    updateTimer(time) {
        const timer = document.getElementById('timer');
        let minutes = String(Math.floor(time / 60)).padStart(2, '0');
        let seconds = String(time % 60).padStart(2, '0');
        timer.innerHTML = `${minutes}:${seconds}`;
    }

    startNewGame() {
        this.resetAllCards();
        setTimeout(() => {
            document.getElementById('game-grid').innerHTML = '';
            this.cards = this.createCardArray(8);
            this.populateCardGrid(this.initialiseCardArray(this.cards));
            this.isCardShowing = false;
            this.isNewGame = true;
            this.lastCard = null;
            this.time = 0;
            this.moves = 0;
            this.matches = 0;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }, 800);
    }
}