function threadsPerInch(y) {
  return {10:42,14:48,26:60,32:64,40:74,60:80,84:96}[y] || 0;
}

function toInches(v,u){ return u==="cm"?v/2.54:v; }

function prefillByCount(){
  const y=+yarnCount.value;
  if(!fabricLength.value) fabricLength.value=29;
  hankLength.value={10:2900,14:2950,26:3000,32:3000,40:3000,60:3100,84:3200}[y]||"";
}

let blockCount=0;

function addNewBlock(data){
  blockCount++;
  const b=document.createElement("div");
  b.className="block";
  b.innerHTML=`<b>Block ${blockCount}</b><div class="rows"></div>
  <button onclick="addRow(this)">Add Row</button>`;
  blocks.appendChild(b);
  (data||[{},{},{}]).forEach(r=>addRowToBlock(b,r.color||"",r.width||""));
}

function addRow(btn){
  addRowToBlock(btn.parentElement);
}

function addRowToBlock(b,c="",w=""){
  const r=document.createElement("div");
  r.className="row";
  r.innerHTML=`<input class="color" placeholder="Colour" value="${c}">
               <input class="width" placeholder="Width" value="${w}">`;
  b.querySelector(".rows").appendChild(r);
}

function calculate() {
  const yarn = Number(document.getElementById("yarnCount").value);
  const fabricLength = Number(document.getElementById("fabricLength").value);
  const hankLength = Number(document.getElementById("hankLength").value);
  const wastage = Number(document.getElementById("wastage").value || 0);
  const repeat = Number(document.getElementById("designRepeat").value || 1);

  const tpi = threadsPerInch(yarn);

  if (!fabricLength || !hankLength || !tpi) {
    alert("Please fill Yarn count, Fabric length and Hank length");
    return;
  }

  let baseThreads = 0;
  let dyeTotals = {};
  let seq = 1;

  let weaverHTML = `
    <table border="1" cellpadding="5">
    <tr><th>Seq</th><th>Colour</th><th>Threads</th></tr>
  `;

  document.querySelectorAll(".row").forEach(r => {
    const c = r.querySelector(".color")?.value?.trim();
    const w = Number(r.querySelector(".width")?.value);

    if (!c || !w || w <= 0) return;

    const threads = w * tpi;
    baseThreads += threads;
    dyeTotals[c] = (dyeTotals[c] || 0) + threads;

    weaverHTML += `
      <tr>
        <td>${seq++}</td>
        <td>${c}</td>
        <td>${threads.toFixed(0)}</td>
      </tr>
    `;
  });

  if (baseThreads === 0) {
    alert("No valid rows found");
    return;
  }

  weaverHTML += `
    <tr>
      <th colspan="2">Base Total</th>
      <th>${baseThreads.toFixed(0)}</th>
    </tr>
    <tr>
      <th colspan="2">After Repeat × ${repeat}</th>
      <th>${(baseThreads * repeat).toFixed(0)}</th>
    </tr>
  </table>
  `;

  document.getElementById("weaverTable").innerHTML = weaverHTML;

  let dyeHTML = `
    <table border="1" cellpadding="5">
    <tr><th>Colour</th><th>Total Threads</th><th>Hanks</th></tr>
  `;

  let totalThreads = 0;
  let totalHanks = 0;

  for (const c in dyeTotals) {
    const threads = dyeTotals[c] * repeat;
    const yarnLen = threads * fabricLength;
    const yarnWithWaste = yarnLen + (yarnLen * wastage / 100);
    const hanks = yarnWithWaste / hankLength;

    totalThreads += threads;
    totalHanks += hanks;

    dyeHTML += `
      <tr>
        <td>${c}</td>
        <td>${threads.toFixed(0)}</td>
        <td>${hanks.toFixed(2)}</td>
      </tr>
    `;
  }

  dyeHTML += `
    <tr>
      <th>TOTAL</th>
      <th>${totalThreads.toFixed(0)}</th>
      <th>${totalHanks.toFixed(2)}</th>
    </tr>
  </table>
  `;

  document.getElementById("dyeTable").innerHTML = dyeHTML;
}

function saveDesign(){
  const name=prompt("Design name"); if(!name) return;
  const designs=JSON.parse(localStorage.designs||"[]");
  const idx=localStorage.currentDesign;

  const blocksData=[];
  document.querySelectorAll(".block").forEach(b=>{
    const rows=[];
    b.querySelectorAll(".row").forEach(r=>{
      rows.push({
        color:r.querySelector(".color").value,
        width:r.querySelector(".width").value
      });
    });
    blocksData.push(rows);
  });

  const data={
    name,
    yarn:yarnCount.value,
    fabricLength:fabricLength.value,
    hankLength:hankLength.value,
    repeat:designRepeat.value,
    unit:globalUnit.value,
    blocks:blocksData
  };

  if(idx!==undefined&&idx!==null) designs[idx]=data;
  else designs.push(data);

  localStorage.designs=JSON.stringify(designs);
  localStorage.removeItem("currentDesign");
  location.href="index.html";
}

(function load(){
  const idx=localStorage.currentDesign;
  if(idx==null){ addNewBlock(); return; }
  const d=JSON.parse(localStorage.designs)[idx];
  yarnCount.value=d.yarn;
  fabricLength.value=d.fabricLength;
  hankLength.value=d.hankLength;
  designRepeat.value=d.repeat;
  globalUnit.value=d.unit;
  d.blocks.forEach(b=>addNewBlock(b));
})();

