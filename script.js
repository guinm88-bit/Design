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

function prefill() {
  const y = document.getElementById("yarnCount").value;
  document.getElementById("fabricLength").value = 29;
  document.getElementById("hankLength").value = yarnDefaults[y].hank;
}

function addBlock(data) {
  blockCount++;
  const b = document.createElement("div");
  b.className = "block";
  b.innerHTML = `<b>Block ${blockCount}</b>
    <div class="rows"></div>
    <button onclick="addRow(this)">Add Row</button>`;
  document.getElementById("blocks").appendChild(b);

  for (let i = 0; i < 3; i++) addRow(b.querySelector("button"));

  if (data) {
    const rows = b.querySelector(".rows").children;
    data.forEach((r, i) => {
      rows[i].children[0].value = r.color;
      rows[i].children[1].value = r.width;
    });
  }
}

function addRow(btn) {
  const rows = btn.previousElementSibling;
  const r = document.createElement("div");
  r.className = "row";
  r.innerHTML = `<input placeholder="Colour">
                 <input type="number" placeholder="Width (inch)">`;
  rows.appendChild(r);
}

function calculate() {
  const yarn = Number(document.getElementById("yarnCount").value);
  const tpi = yarnDefaults[yarn].tpi;
  const repeat = Number(document.getElementById("repeat").value || 1);
  const fabricLength = Number(document.getElementById("fabricLength").value);
  const hankLength = Number(document.getElementById("hankLength").value);

  let colourThreads = {};

  document.querySelectorAll(".row").forEach(r => {
    const c = r.children[0].value.trim();
    const w = Number(r.children[1].value);
    if (!c || !w) return;

    const threads = w * tpi;
    colourThreads[c] = (colourThreads[c] || 0) + threads;
  });

  let baseTotal = 0;
  let weaverText = "Colour\tThreads\n";

  for (const c in colourThreads) {
    weaverText += `${c}\t${colourThreads[c].toFixed(0)}\n`;
    baseTotal += colourThreads[c];
  }

  weaverText += `\nBase Total: ${baseTotal.toFixed(0)} threads`;
  weaverText += `\nAfter Repeat (${repeat}x): ${(baseTotal * repeat).toFixed(0)} threads`;

  document.getElementById("weaverOutput").textContent = weaverText;

  let dyeText = "Colour\tThreads\tHanks\n";
  let totalThreads = 0;
  let totalHanks = 0;

  for (const c in colourThreads) {
    const t = colourThreads[c] * repeat;
    const yarnLen = t * fabricLength;
    const hanks = yarnLen / hankLength;

    dyeText += `${c}\t${t.toFixed(0)}\t${hanks.toFixed(2)}\n`;
    totalThreads += t;
    totalHanks += hanks;
  }

  dyeText += `\nTOTAL THREADS: ${totalThreads.toFixed(0)}`;
  dyeText += `\nTOTAL HANKS: ${totalHanks.toFixed(2)}`;

  document.getElementById("dyeOutput").textContent = dyeText;
}

function saveDesign() {
  const name = document.getElementById("designName").value.trim();
  if (!name) { alert("Enter design name"); return; }

  const design = {
    name,
    yarn: document.getElementById("yarnCount").value,
    fabricLength: document.getElementById("fabricLength").value,
    hankLength: document.getElementById("hankLength").value,
    repeat: document.getElementById("repeat").value,
    blocks: []
  };

  document.querySelectorAll(".block").forEach(b => {
    const rows = [];
    b.querySelectorAll(".row").forEach(r => {
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
  if (idx === null) { addBlock(); return; }

  const d = JSON.parse(localStorage.getItem("designs"))[idx];
  document.getElementById("designName").value = d.name;
  document.getElementById("yarnCount").value = d.yarn;
  document.getElementById("fabricLength").value = d.fabricLength;
  document.getElementById("hankLength").value = d.hankLength;
  document.getElementById("repeat").value = d.repeat;

  d.blocks.forEach(b => addBlock(b));
}

loadDesign();
