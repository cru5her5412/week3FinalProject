fromStorage = localStorage.getItem("storedData");
setup();
if (!fromStorage) {
  let cookieData = {
    upgrades: [10, 2, 1], //first index is amount of first upgrade etc
    cookieCount: 0,
  };
  localStorage.setItem("storedData", JSON.stringify(cookieData));
} else {
  cookieData = JSON.parse(fromStorage);
}
gameActive = setInterval(gameRunning, 1000);

cookie = document.getElementById("theCookie");
cookieCounter = document.getElementById("cookieCounter");
cookie.addEventListener("click", addToCookieCount());
function addToCookieCount() {
  cookieData.cookieCount++;
}
function gameRunning() {
  cookieCounter.textContent = `Cookie Count: ${cookieData.cookieCount}`;
  updateLocalStorage();
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
    const upgrade = document.createElement("div");
    upgrade.textContent = `${upgradesJSON[i].name}:\nCost:${upgradesJSON[i].cost}`;
    upgrade.id = upgradesJSON[i].id;
    upgrade.className = "upgradeItem";
    const container = document.getElementById("upgrades");
    container.appendChild(upgrade);
  }
}
function setup() {
  upgradeDisplayCreation();
}
