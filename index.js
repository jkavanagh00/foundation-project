/** @format */

let isCardShowing = false;
let isNewGame = true;
let lastCard = null;
let time = 0;
let moves = 0;
let matches = 0;
let timerInterval = null;
let isLocked = false;
let currentGameId = null;

async function loadDeck(deckId, numberOfCards = 8) {
  try {
    const response = await fetch(
      `https://flipmaster-backend.onrender.com/cards/deck/${deckId}`,
    );
    const allCards = await response.json();
    const selectedCards = shuffle(allCards).slice(0, numberOfCards);

    const cardArray = selectedCards.map((card) => ({
      name: card.name,
      link: card.link,
      solved: false,
      flipped: false,
    }));

    console.log(`Loaded ${numberOfCards} cards from deck ${deckId}`);

    // Create deep copies for matching pairs
    const pairedCards = [
      ...cardArray,
      ...cardArray.map((card) => ({ ...card })), // Deep copy each card object
    ];

    return shuffle(pairedCards);
  } catch (error) {
    console.error("Error loading deck:", error);
    return [];
  }
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
  const cardGrid = document.getElementById("game-grid");
  cardGrid.innerHTML = "";

  for (let i = 0; i < cardArray.length; i++) {
    const markup = `
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">            
                <img src="images/back.png" alt="card back">
            </div>
            <div class="flip-card-back">
                <img src="${cardArray[i].link}" alt="${cardArray[i].name}">
            </div>
        </div>
    </div>`;
    cardGrid.innerHTML += markup;
  }

  // Attach card data after DOM elements are created
  const cards = document.querySelectorAll(".flip-card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].cardData = cardArray[i];
  }

  attachCardListeners();
}

function attachCardListeners() {
  const cards = document.querySelectorAll(".flip-card");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    card.addEventListener("click", () => {
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
        console.log("revealed card clicked");

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
          if (card.cardData.name === cards[lastCard].cardData.name) {
            // update the solved state on both DOM card;
            card.cardData.solved = true;
            cards[lastCard].cardData.solved = true;
            fadeOutCard(card.cardData.name);
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
        card.classList.toggle("flipped");
      }
    });
  }
}

function fadeOutCard(name) {
  const cards = document.querySelectorAll(".flip-card");

  // set a 1.5 second timer before calling the main function logic
  setTimeout(() => {
    // iterate through all DOM cards
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.cardData.name === name) {
        card.classList.toggle("solved");
      }
    }
    // time out length in milliseconds
  }, 1500);
}

function resetCards() {
  const cards = document.querySelectorAll(".flip-card");
  // lock input at of reset;
  isLocked = true;

  setTimeout(() => {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.cardData.flipped === true && card.cardData.solved === false) {
        card.classList.toggle("flipped");
        card.cardData.flipped = false;
      }
    }
    // unlock input after reset completes;
    isLocked = false;
  }, 1500);
}

function resetAllCards() {
  const cards = document.querySelectorAll(".flip-card");
  // iterate through all DOM cards
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    // check that the card is face up
    if (card.cardData.flipped === true) {
      // flip the card face down
      card.classList.toggle("flipped");
      // update boolean to track that card is face down
      card.cardData.flipped = false;
    }
  }
}

function updateCounters(moves, matches) {
  const movesDOM = document.getElementById("moves");
  movesDOM.innerHTML = `${moves}`;
  const matchesDOM = document.getElementById("matches");
  matchesDOM.innerHTML = `${matches}`;
}

function updateTimer(time) {
  const timer = document.getElementById("timer");
  let minutes = String(Math.floor(time / 60)).padStart(2, "0");
  let seconds = String(time % 60).padStart(2, "0");
  timer.innerHTML = `${minutes}:${seconds}`;
}

function displayWin(time, moves, matches) {
  const popup = document.getElementById("win-popup");
  const scoreValue = calculateScore(time, moves, matches);
  function calculateScore(time, moves, matches) {
    return Math.max(0, matches * 100 - moves * 5 - time);
  }
  if (currentGameId) {
    fetch(`https://flipmaster-backend.onrender.com/games/${currentGameId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: scoreValue }),
    })
      .then(() => {
        loadLeaderboard();
      })
      .catch((err) => console.error("Failed to update game:", err));
  } else {
    console.warn("No currentGameID set - cannot save score");
  }
  const score = document.getElementById("score");
  score.innerHTML = `Score: ${scoreValue}`;
  popup.classList.add("show");
}

async function startNewGame(confirmGame = false) {
  const winPopup = document.getElementById("win-popup");
  const newGamePopup = document.getElementById("new-game-popup");

  if (!confirmGame) {
    // Show the new game popup
    winPopup.classList.remove("show");
    newGamePopup.classList.add("show");
  } else {
    const deckId = document.getElementById("deck-selector").value;
    const numberOfCards = document.getElementById("quantity-selector").value;
    // const playerName = document.getElementById("player-name").value.trim();
    // if (!playerName) {
    //   alert("Please enter a player name");
    //   return;
    // }
    // currentPlayerName = playerName; // store player name

    newGamePopup.classList.remove("show");
    const startResponse = await fetch(
      `https://flipmaster-backend.onrender.com/games`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck_id: deckId,
        }),
      },
    );

    const startData = await startResponse.json();
    currentGameId = startData.game_id; //store game ID

    setTimeout(async () => {
      document.getElementById("game-grid").innerHTML = "";
      const cards = await loadDeck(deckId, numberOfCards);
      populateCardGrid(cards);
      //Reset game state
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
}

function hidePopups() {
  const winPopup = document.getElementById("win-popup");
  const newGamePopup = document.getElementById("new-game-popup");
  winPopup.classList.remove("show");
  newGamePopup.classList.remove("show");
}
document
  .getElementById("loadLeaderboard")
  .addEventListener("click", loadLeaderboard);

async function loadLeaderboard() {
  try {
    const response = await fetch(
      `https://flipmaster-backend.onrender.com/leaderboard?nocache=${Date.now()}`,
    );
    const data = await response.json();

    const tbody = document.querySelector("#leaderboardTable tbody");
    tbody.innerHTML = ""; // clear old rows

    data.forEach((player) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${player.total_score}</td>
        <td>${player.games_played}</td>
        <td>${player.best_score}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
  }
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  startNewGame();
});
