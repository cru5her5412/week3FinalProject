//🐿️ As a developer, I want to retrieve upgrade information from an API so that all the developers working on the game can access a single, consistent source of up-to-date information. done
// 🐿️As a user, I want to be able to purchase upgrades from the shop so that I can enhance my gameplay experience.
// 🐿️ As a developer, I want to use functions effectively to keep my code organised and reusable.
// 🐿️ As a user, I’d like the website to respond dynamically so that my interactions with the website are responsive and smooth.
// 🐿️ As a user, I want my cookie count and relevant game information to be stored in local storage so that my progress is saved and I can continue playing from where I left off later.
// 🐿️ As a user, I want the cookie count to increment automatically and the game state to update each second so that the game progresses even when I’m not actively clicking.
// 🐿️ As a user, I want the game state to be managed every second using setInterval to ensure my progress is saved and the game remains updated.
// Requirements
// 🎯 Fetch upgrade data from the provided API and at least one upgrade from the API update the cookie count.
// 🎯 Ensure that functions are used effectively to keep code organised and reusable.
// 🎯 Implement event listeners to handle user interactions.
// 🎯 Use local storage to save and restore the cookie count and relevant game information.
// 🎯 Use setInterval to increment the cookie count and manage the game state each second.
// Managing the game state includes saving progress and updating the DOM.
fromStorage = localStorage.getItem("storedData");
if (!fromStorage) {
  let cookieData = {
    upgrades: [], //first index is amount of first upgrade etc
    cookieCount: 0,
  };
  localStorage.setItem("storedData", JSON.stringify(cookieData));
} else {
  cookieData = JSON.parse(fromStorage);
}
let cps = 0;
let upgradesArray = [];
let upgradesAddToCps = 0;
mainCookie = document.getElementById("theCookie");
cookieCounter = document.getElementById("cookieCounter");
mainCookie.addEventListener("click", function () {
  addToCookieCount();
});
setup();
function addToCookieCount() {
  cookieData.cookieCount += 1;
  updateLocalStorage();
  updateDOM();

  //updateDOM();
}
function gameRunning() {
  cookieData.cookieCount += cps;
  cookieData.upgrades = upgradesArray;

  updateLocalStorage();
  updateDOM();
}
function updateLocalStorage() {
  localStorage.setItem("storedData", JSON.stringify(cookieData));
}
async function upgradeDisplayCreation() {
  let upgradesResponse = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  upgradesJSON = await upgradesResponse.json();
  for (let i = 0; i < upgradesJSON.length; i++) {
    upgradesArray.push(0);
    const upgrade = document.createElement("button");
    upgrade.textContent = `${upgradesJSON[i].name}:\nCost:${upgradesJSON[i].cost}`;
    upgrade.id = upgradesJSON[i].id;
    upgrade.className = "upgradeItem";
    const container = document.getElementById("upgrades");
    container.appendChild(upgrade);
    upgrade.addEventListener("click", function () {
      buyingUpgrades(i + 1);
    });
  }
}
function setup() {
  upgradeDisplayCreation();
  gameActive = setInterval(function () {
    gameRunning();
  }, 1000);
}
function updateDOM() {
  cookieCounter.textContent = `Cookie count: ${cookieData.cookieCount}`;
}
function buyingUpgrades(upgradeId) {
  cps -= upgradesAddToCps;
  upgradesAddToCps = 0;
  if (cookieData.cookieCount >= upgradesJSON[upgradeId - 1].cost) {
    cookieData.cookieCount -= upgradesJSON[upgradeId - 1].cost;
    upgradesArray[upgradeId - 1] += 1;
    updateDOM();
    for (let i = 0; i < upgradesArray.length; i++) {
      upgradesAddToCps += upgradesJSON[i].increase * upgradesArray[i];
      cookieCounter.textContent = `Cookie Count: ${cookieData.cookieCount}`;
    }
  }
  cps += upgradesAddToCps;
}
