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

function calculate(){
  const tpi=threadsPerInch(+yarnCount.value);
  let base=0, dye={};
  document.querySelectorAll(".row").forEach(r=>{
    const c=r.querySelector(".color").value;
    const w=r.querySelector(".width").value;
    if(!c||!w) return;
    const th=toInches(+w,globalUnit.value)*tpi;
    base+=th;
    dye[c]=(dye[c]||0)+th;
  });

  weaverTable.innerHTML=`Total Threads: ${base*designRepeat.value}`;

  let out="<table><tr><th>Colour</th><th>Hanks</th></tr>";
  for(let c in dye){
    const h=(dye[c]*designRepeat.value*fabricLength.value)/hankLength.value;
    out+=`<tr><td>${c}</td><td>${h.toFixed(2)}</td></tr>`;
  }
  out+="</table>";
  dyeTable.innerHTML=out;
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
