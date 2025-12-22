function loadDesigns() {
  const list = JSON.parse(localStorage.getItem("designs") || "[]");
  const box = document.getElementById("designs");
  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = "<p>No saved designs</p>";
    return;
  }

  list.forEach((d, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <b>${d.name}</b><br>
      <button onclick="openDesign(${i})">Open</button>
    `;
    box.appendChild(div);
  });
}

function newDesign() {
  localStorage.removeItem("currentDesign");
  location.href = "editor.html";
}

function openDesign(i) {
  localStorage.setItem("currentDesign", i);
  location.href = "editor.html";
}

loadDesigns();
