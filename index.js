/** @format */

let cards = [
  {
    name: "battery",
    id: 1,
    location: "images/battery-minus.png",
  },
  {
    name: "biplane",
    id: 2,
    location: "images/biplane.png",
  },
  {
    name: "card-pickup",
    id: 3,
    location: "images/card-pickup.png",
  },
  {
    name: "card-play",
    id: 4,
    location: "images/card-play.png",
  },
  {
    name: "chocolate-bar",
    id: 5,
    location: "images/chocolate-bar.png",
  },
  {
    name: "hearts",
    id: 6,
    location: "images/hearts.png",
  },
  {
    name: "poppy",
    id: 7,
    location: "images/poppy.png",
  },
  {
    name: "thrust",
    id: 8,
    location: "images/thrust.png",
  },
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeCardArray(cards) {
  const newArray = cards.concat(cards);
  const cardArray = shuffle(newArray);
  return cardArray;
}

function populateCardGrid(cardArray) {
  const cardGrid = document.getElementById("game-grid");
  cardGrid.innerHTML = ""; // clear old cards
  for (let i = 0; i < cardArray.length; i++) {
    const markup = `
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="back.png" alt="card back" style="width:100px;height:100px;border-radius: 40px;">
                </div>
                <div class="flip-card-back">
                    <img src=${cardArray[i].location} alt="card front" style="width:300px;height:300px;border-radius: 40px;">
                </div>
            </div>
        </div>`;
    cardGrid.innerHTML += markup;
  }
}

console.log(initializeCardArray(cards));
