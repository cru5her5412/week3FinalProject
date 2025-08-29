fromStorage = localStorage.getItem("storedData");
upgrades = fetch("https://cookie-upgrade-api.vercel.app/api/upgrades");
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
function upgradeDisplayCreation() {
  parsedUpgrades = JSON.parse(upgrades);
}
