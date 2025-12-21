function loadDesigns() {
  const list = document.getElementById("designList");
  const designs = JSON.parse(localStorage.getItem("designs") || "[]");

  if (designs.length === 0) {
    list.innerHTML = "<p>No saved designs</p>";
    return;
  }

  designs.forEach((d, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${d.name}</b>
      <button onclick="openDesign(${i})">Open</button>
    `;
    list.appendChild(div);
  });
}

function newDesign() {
  localStorage.removeItem("currentDesign");
  window.location.href = "editor.html";
}

function openDesign(i) {
  localStorage.setItem("currentDesign", i);
  window.location.href = "editor.html";
}

window.onload = loadDesigns;
