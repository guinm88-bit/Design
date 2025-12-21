function loadDesigns() {
  const list = document.getElementById("designList");
  list.innerHTML = "";

  const designs = JSON.parse(localStorage.getItem("designs") || "[]");

  if (designs.length === 0) {
    list.innerHTML = "<p>No designs yet</p>";
    return;
  }

  designs.forEach((d, i) => {
    const div = document.createElement("div");
    div.className = "design";
    div.innerHTML = `
      <strong>${d.name}</strong><br>
      Yarn: ${d.yarn}s
    `;
    div.onclick = () => openDesign(i);
    list.appendChild(div);
  });
}

function newDesign() {
  localStorage.removeItem("currentDesign");
  window.location.href = "editor.html";
}

function openDesign(index) {
  localStorage.setItem("currentDesign", index);
  window.location.href = "editor.html";
}

loadDesigns();
