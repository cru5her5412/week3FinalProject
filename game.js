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
mainCookie = document.getElementById("theCookie");
cookieCounter = document.getElementById("cookieCounter");
mainCookie.addEventListener("click", function () {
  addToCookieCount();
});
setup();
function addToCookieCount() {
  cookieData.cookieCount += 1;
  console.log(cookieData.cookieCount);
  updateLocalStorage();

  //updateDOM();
}
function gameRunning() {
  cookieCounter.textContent = `Cookie Count: ${cookieData.cookieCount}`;
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
    const upgrade = document.createElement("button");
    upgrade.textContent = `${upgradesJSON[i].name}:\nCost:${upgradesJSON[i].cost}`;
    upgrade.id = upgradesJSON[i].id;
    upgrade.className = "upgradeItem";
    const container = document.getElementById("upgrades");
    container.appendChild(upgrade);
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
function buyingUpgrades() {}
