/* ==========================================
   MI.C.L.A — ADMIN PROGRAMME SANS API
========================================== */

const PROGRAMME_KEY = "micla_programme_admin";

// Protection admin
if (localStorage.getItem("micla_admin_auth")!== "true") {
  window.location.replace("admin.html");
}

function getProgrammeData() {
  const data = [];
  for (let i = 0; i < 9; i++) {
    const preacher = document.getElementById("preacher-" + i);
    const moderator = document.getElementById("moderator-" + i);
    data.push({
      preacher: preacher? preacher.value.trim() : "",
      moderator: moderator? moderator.value.trim() : ""
    });
  }
  return data;
}

function saveProgramme() {
  const data = getProgrammeData();
  localStorage.setItem(PROGRAMME_KEY, JSON.stringify(data));
  showMessage("✅ Programme enregistré en local", "success");
}

function loadProgramme() {
  const saved = localStorage.getItem(PROGRAMME_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    for (let i = 0; i < 9; i++) {
      const preacher = document.getElementById("preacher-" + i);
      const moderator = document.getElementById("moderator-" + i);
      if (preacher) preacher.value = data[i]?.preacher || "";
      if (moderator) moderator.value = data[i]?.moderator || "";
    }
  } catch (e) {
    console.error(e);
  }
}

function resetProgramme() {
  if (!confirm("Voulez-vous vraiment supprimer tous les noms?")) return;

  localStorage.removeItem(PROGRAMME_KEY);

  for (let i = 0; i < 9; i++) {
    const p = document.getElementById("preacher-" + i);
    const m = document.getElementById("moderator-" + i);
    if (p) p.value = "";
    if (m) m.value = "";
  }
  showMessage("↺ Tous les noms supprimés", "success");
}

function showMessage(text, type) {
  const message = document.getElementById("message");
  if (!message) return;
  message.textContent = text;
  message.className = "message show " + type;
  setTimeout(() => {
    message.className = "message";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProgramme();
  document.getElementById("save-programme")?.addEventListener("click", saveProgramme);
  document.getElementById("reset-programme")?.addEventListener("click", resetProgramme);
});