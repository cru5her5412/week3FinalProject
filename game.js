// Requirements
// 🎯 Fetch upgrade data from the provided API and at least one upgrade from the API update the cookie count. done
// 🎯 Ensure that functions are used effectively to keep code organised and reusable.
// 🎯 Implement event listeners to handle user interactions.
// 🎯 Use local storage to save and restore the cookie count and relevant game information.
// 🎯 Use setInterval to increment the cookie count and manage the game state each second.
// Managing the game state includes saving progress and updating the DOM.

// 🏹 Consolidate upgrade management by managing all upgrades in a single function. done
// 🏹 Improve UX with animations, sound effects, or other visual effects.
// 🏹 Fantastic use of README to provide important information such as a description of the project, how to deploy and other app information.
// 🏹 Implement error handling using try/catch.
// 🏹 Create a menu for users to adjust game options like sound effects or display preferences.
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
settingsIcon = document.getElementById("settings");
settingsIcon.addEventListener("click", function () {
  settings();
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
function settings() {
  if (!document.getElementById("settingsMenu")) {
    const settingsMenu = document.createElement("button");
    settingsMenu.id = "settingsMenu";
    settingsMenu.textContent =
      "Press to reset cookies and cps (THIS IS PERMANENT), press on cog again to hide";
    settingsMenu.style.zIndex = 1000;
    settingsMenu.ariaLabel =
      "Remove all cookies and upgrades permanently, press on settings icon to rehide";
    body = document.querySelector("body");
    body.appendChild(settingsMenu);
    settingsMenu.addEventListener("click", function () {
      cookieData = {
        upgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        cookieCount: 0,
      };
    });
  } else if (document.getElementById("settingsMenu")) {
    toBeRemoved = document.getElementById("settingsMenu");
    toBeRemoved.removeEventListener("click", function () {
      cookieData = {
        upgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        cookieCount: 0,
      };
    });
    toBeRemoved.remove();
  }
}
