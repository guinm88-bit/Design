function loadDesigns() {
  const container = document.getElementById("designs");
  container.innerHTML = "";

  const designs = JSON.parse(localStorage.getItem("designs") || "[]");

  if (designs.length === 0) {
    container.innerHTML = "<p>No saved designs</p>";
    return;
  }

  designs.forEach((d, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<b>${d.name}</b><br>Yarn: ${d.yarn}s`;
    div.onclick = () => {
      localStorage.setItem("currentDesign", i);
      window.location.href = "editor.html";
    };
    container.appendChild(div);
  });
}

function newDesign() {
  localStorage.removeItem("currentDesign");
  window.location.href = "editor.html";
}

loadDesigns();
