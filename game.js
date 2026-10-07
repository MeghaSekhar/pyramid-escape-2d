
// ==========================================
// 🎮 GAME STATE & LOGIC
// ==========================================
let currentChamber = 1;
let u5 = 0, u3 = 0, basin = 0;

const dialogueEl = document.getElementById('dialogue');
const controlsEl = document.getElementById('controls');
const titleEl = document.getElementById('chamber-title');

function setDialogue(msg) {
  dialogueEl.innerText = msg;
}

function loadChamber1UI() {
  titleEl.innerText = "Chamber 1 / 20";
  controlsEl.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px;">
      <button onclick="fillUrn(5)">Fill 5L</button>
      <button onclick="fillUrn(3)">Fill 3L</button>
      <button onclick="pour5ToBasin()" style="background: #2e6f40; color:#fff;">Pour 5L ➔ Basin</button>
      <button onclick="pour(5, 3)">Pour 5L ➔ 3L</button>
      <button onclick="pour(3, 5)">Pour 3L ➔ 5L</button>
      <button onclick="resetBasin()" style="background: #8b2b2b; color:#fff;">Empty Basin</button>
      <button onclick="emptyUrn(5)">Empty 5L</button>
      <button onclick="emptyUrn(3)">Empty 3L</button>
    </div>
  `;
}

function fillUrn(type) {
  playSound('pour');
  if (type === 5) u5 = 5;
  if (type === 3) u3 = 3;
  setDialogue(`Maya: "Filled the ${type}L urn with water."`);
  renderCanvas();
}

function emptyUrn(type) {
  playSound('click');
  if (type === 5) u5 = 0;
  if (type === 3) u3 = 0;
  setDialogue(`Maya: "Emptied the ${type}L urn onto the stone floor."`);
  renderCanvas();
}

function pour(from, to) {
  playSound('pour');
  if (from === 5 && to === 3) {
    let space = 3 - u3;
    let transfer = Math.min(u5, space);
    u5 -= transfer; u3 += transfer;
    setDialogue(`Maya: "Poured ${transfer}L from 5L urn into 3L urn."`);
  } else if (from === 3 && to === 5) {
    let space = 5 - u5;
    let transfer = Math.min(u3, space);
    u3 -= transfer; u5 += transfer;
    setDialogue(`Maya: "Poured ${transfer}L from 3L urn into 5L urn."`);
  }
  renderCanvas();
}

function pour5ToBasin() {
  if (u5 === 0) {
    playSound('click');
    setDialogue("Maya: 'The 5L urn is completely empty!'");
    return;
  }

  basin += u5;
  u5 = 0;

  if (basin === 4) {
    playSound('success');
    setDialogue("🎉 SUCCESS! The scale balances perfectly! The heavy stone door opens!");
    renderCanvas();
    setTimeout(goToChamber2, 2000);
  } else if (basin > 4) {
    playSound('trap');
    setDialogue(`🚨 TRAP TRIGGERED! The basin overflowed (${basin}L)! resetting basin...`);
    basin = 0;
    renderCanvas();
  } else {
    playSound('pour');
    setDialogue(`Maya: "Poured water into scale basin. Basin now holds ${basin}L."`);
    renderCanvas();
  }
}

function resetBasin() {
  playSound('click');
  basin = 0;
  setDialogue("Maya: 'Emptied the scale basin.'");
  renderCanvas();
}

function goToChamber2() {
  currentChamber = 2;
  titleEl.innerText = "Chamber 2 / 20";
  setDialogue("Maya: 'We stepped into Chamber 2... ahead lies a strange wall of glowing runes.'");
  controlsEl.innerHTML = `<button onclick="alert('Chamber 2 under construction!')">Inspect Wall</button>`;
  renderCanvas();
}

// Initialize Game
loadChamber1UI();
renderCanvas();
