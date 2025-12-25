const yarnDefaults = {
  10: { tpi: 42, hank: 2900 },
  14: { tpi: 48, hank: 2950 },
  26: { tpi: 60, hank: 3000 },
  32: { tpi: 64, hank: 3000 },
  40: { tpi: 74, hank: 3000 },
  60: { tpi: 80, hank: 3100 },
  84: { tpi: 96, hank: 3200 }
};

let blockCount = 0;

/* ---------- PREFILL ---------- */
function prefill() {
  const y = document.getElementById("yarnCount").value;
  if (!y) return;

  document.getElementById("fabricLength").value = 29;
  document.getElementById("hankLength").value = yarnDefaults[y].hank;
}

/* ---------- BLOCKS & ROWS ---------- */
function addBlock(data = []) {
  blockCount++;

  const block = document.createElement("div");
  block.className = "block";

  block.innerHTML = `
    <b>Block ${blockCount}</b>
    <div class="rows"></div>
    <button onclick="addRow(this)">Add Row</button>
  `;

  document.getElementById("blocks").appendChild(block);

  if (data.length === 0) {
    for (let i = 0; i < 3; i++) addRow(block.querySelector("button"));
  } else {
    data.forEach(r => {
      addRow(block.querySelector("button"), r.color, r.width);
    });
  }
}

function addRow(btn, color = "", width = "") {
  const rows = btn.previousElementSibling;

  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
  <input placeholder="Colour" value="${color}">
  <input type="number" placeholder="Width (inch)" value="${width}" oninput="updateRowThreads(this)">
  <input placeholder="Threads" readonly>
`;


  rows.appendChild(row);
}

function updateRowThreads(input) {
  const row = input.closest(".row");
  const width = Number(input.value || 0);
  const yarn = Number(document.getElementById("yarnCount").value);
  const tpiMap = {10:42,14:48,26:60,32:64,40:74,60:80,84:96};
  const tpi = tpiMap[yarn] || 0;

  const threads = width * tpi;
  row.querySelectorAll("input")[2].value = threads.toFixed(0);
}

/* ---------- CALCULATION ---------- */
function calculate() {
  const yarn = document.getElementById("yarnCount").value;
  const repeat = Number(document.getElementById("repeat").value || 1);
  const fabricLength = Number(document.getElementById("fabricLength").value);
  const hankLength = Number(document.getElementById("hankLength").value);

  const weaverBox = document.getElementById("weaverOutput");
  const dyeBox = document.getElementById("dyeOutput");

  weaverBox.textContent = "";
  dyeBox.textContent = "";

  if (!yarn || !fabricLength || !hankLength) {
    weaverBox.textContent = "Please select yarn count and fill lengths.";
    return;
  }

  const tpi = yarnDefaults[yarn].tpi;
  let colourMap = {};
  let hasValidRow = false;

  document.querySelectorAll(".row").forEach(row => {
    const colour = row.children[0].value.trim();
    const width = Number(row.children[1].value);

    if (!colour || width <= 0) return;

    hasValidRow = true;
    const threads = width * tpi;
    colourMap[colour] = (colourMap[colour] || 0) + threads;
  });

  if (!hasValidRow) {
    weaverBox.textContent = "No valid colour rows entered.";
    return;
  }

  /* ---- Weaver Output ---- */
  let weaverText = "Colour\tThreads\n";
  let baseTotal = 0;

  for (const c in colourMap) {
    weaverText += `${c}\t${colourMap[c].toFixed(0)}\n`;
    baseTotal += colourMap[c];
  }

  weaverText += `\nBase Total: ${baseTotal.toFixed(0)}`;
  weaverText += `\nAfter Repeat (${repeat}x): ${(baseTotal * repeat).toFixed(0)}`;

  weaverBox.textContent = weaverText;

  /* ---- Dyeing Output ---- */
  let dyeText = "Colour\tThreads\tHanks\n";
  let totalThreads = 0;
  let totalHanks = 0;

  for (const c in colourMap) {
    const threads = colourMap[c] * repeat;
    const yarnLen = threads * fabricLength;
    const hanks = yarnLen / hankLength;

    dyeText += `${c}\t${threads.toFixed(0)}\t${hanks.toFixed(2)}\n`;
    totalThreads += threads;
    totalHanks += hanks;
  }

  dyeText += `\nTOTAL THREADS: ${totalThreads.toFixed(0)}`;
  dyeText += `\nTOTAL HANKS: ${totalHanks.toFixed(2)}`;

  dyeBox.textContent = dyeText;
}

/* ---------- SAVE / LOAD ---------- */
function saveDesign() {
  const name = document.getElementById("designName").value.trim();
  if (!name) {
    alert("Enter design name");
    return;
  }

  const design = {
    name,
    yarn: document.getElementById("yarnCount").value,
    fabricLength: document.getElementById("fabricLength").value,
    hankLength: document.getElementById("hankLength").value,
    repeat: document.getElementById("repeat").value,
    blocks: []
  };

  document.querySelectorAll(".block").forEach(block => {
    const rows = [];
    block.querySelectorAll(".row").forEach(r => {
      const c = r.children[0].value;
      const w = r.children[1].value;
      if (c && w) rows.push({ color: c, width: w });
    });
    design.blocks.push(rows);
  });

  const designs = JSON.parse(localStorage.getItem("designs") || "[]");
  const idx = localStorage.getItem("currentDesign");

  if (idx !== null) designs[idx] = design;
  else designs.push(design);

  localStorage.setItem("designs", JSON.stringify(designs));
  window.location.href = "index.html";
}

function loadDesign() {
  const idx = localStorage.getItem("currentDesign");
  prefill();

  if (idx === null) {
    addBlock();
    return;
  }

  const d = JSON.parse(localStorage.getItem("designs"))[idx];

  document.getElementById("designName").value = d.name;
  document.getElementById("yarnCount").value = d.yarn;
  document.getElementById("fabricLength").value = d.fabricLength;
  document.getElementById("hankLength").value = d.hankLength;
  document.getElementById("repeat").value = d.repeat;

  d.blocks.forEach(b => addBlock(b));
}

loadDesign();


