//🐿️ As a developer, I want to retrieve upgrade information from an API so that all the developers working on the game can access a single, consistent source of up-to-date information.
// 🐿️As a user, I want to be able to purchase upgrades from the shop so that I can enhance my gameplay experience.
// 🐿️ As a developer, I want to use functions effectively to keep my code organised and reusable.
// 🐿️ As a user, I’d like the website to respond dynamically so that my interactions with the website are responsive and smooth.
// 🐿️ As a user, I want my cookie count and relevant game information to be stored in local storage so that my progress is saved and I can continue playing from where I left off later.
// 🐿️ As a user, I want the cookie count to increment automatically and the game state to update each second so that the game progresses even when I’m not actively clicking.
// 🐿️ As a user, I want the game state to be managed every second using setInterval to ensure my progress is saved and the game remains updated.
// Requirements
// 🎯 Fetch upgrade data from the provided API and at least one upgrade from the API update the cookie count. done
// 🎯 Ensure that functions are used effectively to keep code organised and reusable.
// 🎯 Implement event listeners to handle user interactions.
// 🎯 Use local storage to save and restore the cookie count and relevant game information.
// 🎯 Use setInterval to increment the cookie count and manage the game state each second.
// Managing the game state includes saving progress and updating the DOM.
let cookieData;
let cps = 0;
let upgradesAddToCps = 0;
fromStorage = localStorage.getItem("storedData");
let upgradesJSON;
if (!fromStorage) {
  cookieData = {
    upgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //first index is amount of first upgrade etc
    cookieCount: 0,
  };
  localStorage.setItem("storedData", JSON.stringify(cookieData));
} else {
  cookieData = JSON.parse(fromStorage);
}

mainCookie = document.getElementById("theCookie");
cookieCounter = document.getElementById("cookieCounter");
cookiesPerSecond = document.getElementById("cookiesPerSecond");
mainCookie.addEventListener("click", function () {
  addToCookieCount();
});
setup();
function setup() {
  upgradeDisplayCreation();
  gameActive = setInterval(function () {
    gameRunning();
  }, 1000);
}
async function upgradeDisplayCreation() {
  let upgradesResponse = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  upgradesJSON = await upgradesResponse.json();
  for (let i = 0; i < upgradesJSON.length; i++) {
    const upgrade = document.createElement("button");
    upgrade.textContent = `${upgradesJSON[i].name}:\nCost:${upgradesJSON[i].cost}`;
    upgrade.id = upgradesJSON[i].id;
    upgrade.className = "upgradeItem";
    const container = document.getElementById("upgrades");
    container.appendChild(upgrade);
    upgrade.addEventListener("click", function () {
      buyingUpgrades(i);
    });
  }
  for (let i = 0; i < cookieData.upgrades.length; i++) {
    upgradesAddToCps += upgradesJSON[i].increase * cookieData.upgrades[i];
  }
  cps += upgradesAddToCps;
}

function updateDOM() {
  cookieCounter.textContent = `Cookie count: ${cookieData.cookieCount}`;
  cookiesPerSecond.textContent = `CPS: ${cps}`;
}
function updateLocalStorage() {
  localStorage.setItem("storedData", JSON.stringify(cookieData));
}
function addToCookieCount() {
  cookieData.cookieCount += 1;
  updateLocalStorage();
  updateDOM();

  //updateDOM();
}

async function buyingUpgrades(upgradeId) {
  if (cookieData.cookieCount >= upgradesJSON[upgradeId].cost) {
    cps -= upgradesAddToCps;
    upgradesAddToCps = 0;
    cookieData.cookieCount -= upgradesJSON[upgradeId].cost;
    console.log(cookieData);
    cookieData.upgrades[upgradeId] = cookieData.upgrades[upgradeId] + 1;
    for (let i = 0; i < cookieData.upgrades.length; i++) {
      upgradesAddToCps += upgradesJSON[i].increase * cookieData.upgrades[i];
    }
    cps += upgradesAddToCps;
  }

  updateDOM();
  updateLocalStorage();
}
function gameRunning() {
  cookieData.cookieCount += cps;

  updateLocalStorage();
  updateDOM();
}
