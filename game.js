const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dialogue = document.getElementById('dialogue');
const controls = document.getElementById('controls');
const chamberTitle = document.getElementById('chamber-title');

let currentLevel = 1;
let state = { urn5: 0, urn3: 0 }; // State for Chamber 1

// Game loop for lighting & atmospheric effects
function renderCanvas(level) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Room Background
  ctx.fillStyle = "#110d08";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Door / Archway
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = 6;
  ctx.strokeRect(180, 40, 200, 220);

  // Draw Flickering Torch Light
  let flicker = Math.random() * 10;
  let grad = ctx.createRadialGradient(280, 150, 10, 280, 150, 180 + flicker);
  grad.addColorStop(0, "rgba(255, 140, 0, 0.3)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0.85)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Level-Specific Visual Props (No Animations Needed)
  if (level === 1) {
    ctx.fillStyle = "#4a86e8";
    // 5L Urn fill height
    ctx.fillRect(80, 240 - state.urn5 * 20, 50, state.urn5 * 20);
    ctx.strokeStyle = "#aaa";
    ctx.strokeRect(80, 140, 50, 100);
    
    // 3L Urn fill height
    ctx.fillRect(430, 240 - state.urn3 * 20, 50, state.urn3 * 20);
    ctx.strokeRect(430, 180, 50, 60);

    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.fillText(`5L Urn: ${state.urn5}L`, 70, 260);
    ctx.fillText(`3L Urn: ${state.urn3}L`, 420, 260);
  }
}

function loadLevel(level) {
  chamberTitle.innerText = `Chamber ${level} / 20`;
  controls.innerHTML = "";

  if (level === 1) {
    dialogue.innerText = "Chamber 1: The Trial of Balance. Pour water between the urns to get EXACTLY 4 Liters into the 5L Urn to trigger the door pressure plate.";
    
    controls.innerHTML = `
      <button onclick="fill5()">Fill 5L Urn</button>
      <button onclick="fill3()">Fill 3L Urn</button>
      <button onclick="pour5to3()">Pour 5L $\rightarrow$ 3L</button>
      <button onclick="empty3()">Empty 3L Urn</button>
    `;
  } else if (level === 2) {
    dialogue.innerText = "Chamber 2: The Acoustic Vault. Strike the four tuning forks in order of pitch (1=Low, 4=High) to resonate the lock bar key: 'Low -> High -> Medium -> Low'.";
    state.sequence = [];
    controls.innerHTML = `
      <button onclick="strikeFork(1)">Fork 1 (Low)</button>
      <button onclick="strikeFork(3)">Fork 3 (Med)</button>
      <button onclick="strikeFork(4)">Fork 4 (High)</button>
    `;
  } else if (level === 3) {
    dialogue.innerText = "Chamber 3: The Chamber of Echoes. Speak into the microphone cone: What perishes the moment its name is spoken?";
    controls.innerHTML = `
      <input type="text" id="riddle-input" placeholder="Type your answer...">
      <button onclick="checkRiddle()">Speak</button>
    `;
  } else {
    dialogue.innerText = "🎉 CONGRATULATIONS! You escaped the pyramid MVP levels! Expand levels 4-20 in game.js!";
    controls.innerHTML = "";
  }
  renderCanvas(level);
}

// Chamber 1 Logic
function fill5() { state.urn5 = 5; checkChamber1(); }
function fill3() { state.urn3 = 3; checkChamber1(); }
function empty3() { state.urn3 = 0; checkChamber1(); }
function pour5to3() {
  let spaceIn3 = 3 - state.urn3;
  let amountToPour = Math.min(state.urn5, spaceIn3);
  state.urn5 -= amountToPour;
  state.urn3 += amountToPour;
  checkChamber1();
}
function checkChamber1() {
  renderCanvas(1);
  if (state.urn5 === 4) {
    alert("CRACK! The pressure plate settles. Chamber 1 Cleared!");
    currentLevel = 2;
    loadLevel(2);
  }
}

// Chamber 2 Logic
function strikeFork(pitch) {
  state.sequence.push(pitch);
  if (state.sequence.length === 4) {
    if (JSON.stringify(state.sequence) === JSON.stringify([1, 4, 3, 1])) {
      alert("RESONANCE ACHIEVED! The bronze bar retracts. Chamber 2 Cleared!");
      currentLevel = 3;
      loadLevel(3);
    } else {
      alert("Discordant chime! The lock resets.");
      state.sequence = [];
    }
  }
}

// Chamber 3 Logic
function checkRiddle() {
  let ans = document.getElementById('riddle-input').value.toLowerCase().trim();
  if (ans === 'silence') {
    alert("The acoustic lock unlocks silently. Chamber 3 Cleared!");
    currentLevel = 4;
    loadLevel(4);
  } else {
    alert("Incorrect echo. Try again!");
  }
}

// Initialize Game Loop
setInterval(() => renderCanvas(currentLevel), 100);
loadLevel(1);
