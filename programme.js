// Même clé que ton admin
const PROGRAMME_KEY = "micla_programme_admin";

function loadPublicLocal() {
  const tbody = document.getElementById('program-table');
  if (!tbody) return;

  const saved = localStorage.getItem(PROGRAMME_KEY);
  if (!saved) return; // garde ton tableau par défaut avec les —

  try {
    const data = JSON.parse(saved);

    // On récupère les lignes existantes
    const rows = tbody.querySelectorAll('tr');

    data.forEach((item, i) => {
      if (rows[i]) {
        const cells = rows[i].querySelectorAll('td');
        // cells[3] = prédicateur, cells[4] = modérateur
        if (cells[3]) {
          cells[3].textContent = item.preacher || "—";
          cells[3].className = item.preacher? "person" : "person empty";
        }
        if (cells[4]) {
          cells[4].textContent = item.moderator || "—";
          cells[4].className = item.moderator? "person" : "person empty";
        }
      }
    });

  } catch (e) {
    console.error(e);
  }
}

function toggleList(id, btn) {
  document.getElementById(id).classList.toggle('show');
  btn.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  loadPublicLocal();
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
});