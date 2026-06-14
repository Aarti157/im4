const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];


window.addEventListener("load", async () => {


  // User-Infos laden
  try {
    const res = await fetch("/api/protected.php", { credentials: "include" });
    if (res.status === 401) { window.location.href = "/login.html"; return; }
    const data = await res.json();
    document.getElementById("userName").textContent = data.name || data.email;
    document.getElementById("userOrga").textContent = data.organisation || "";
  } catch (e) {
    window.location.href = "/login.html";
  }


  // Wochenübersicht laden
  async function loadWoche() {
    try {
      const res = await fetch("/api/woche.php", { credentials: "include" });
      const result = await res.json();


      const container = document.getElementById("wocheContainer");
      const montag = new Date(result.montag);


      container.innerHTML = TAGE.map((tag, i) => {
        const datum = new Date(montag);
        datum.setDate(montag.getDate() + i);
        const datumStr = datum.toISOString().split("T")[0];


        const gericht = result.data.find(g => g.date === datumStr);


        return `
          <div class="tag-karte" data-datum="${datumStr}" style="cursor:pointer">
            <div class="tag-label">${tag}</div>
            <div class="tag-datum">${datum.toLocaleDateString("de-CH")}</div>
            ${gericht
              ? `<div class="gericht-name">${gericht.name}</div>
                 <div class="gericht-desc">${gericht.description || ""}</div>`
              : `<div class="kein-gericht">Noch kein Gericht erfasst</div>`
            }
          </div>
        `;
      }).join("");
    } catch (e) {
      document.getElementById("wocheContainer").innerHTML = "<p>Fehler beim Laden.</p>";
    }
  }


  loadWoche();
// Klick auf Tageskarte → Bewertungs-Modal öffnen
document.getElementById("wocheContainer").addEventListener("click", async (e) => {
  const karte = e.target.closest("[data-datum]");
  if (!karte) return;


  const datum = karte.dataset.datum;


  try {
    const res = await fetch(`/api/gerichte.php?datum=${datum}`, { credentials: "include" });
    const result = await res.json();
    const d = result.data;


    const total = d?.total_bewertungen || 0;
    const good = d?.good || 0;
    const neutral = d?.neutral || 0;
    const bad = d?.bad || 0;


    document.getElementById("bewertungDatum").textContent = datum;
    document.getElementById("bewertungGood").textContent = good;
    document.getElementById("bewertungNeutral").textContent = neutral;
    document.getElementById("bewertungBad").textContent = bad;
    document.getElementById("bewertungTotal").textContent = total;
    document.getElementById("bewertungModal").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Fehler beim Laden der Bewertungen.");
  }
});


// Bewertungs-Modal schliessen
document.getElementById("bewertungModalClose").addEventListener("click", () => {
  document.getElementById("bewertungModal").style.display = "none";
});
  // Modal öffnen/schliessen
  document.getElementById("openModal").addEventListener("click", () => {
    document.getElementById("gerichtModal").style.display = "block";
  });


  document.getElementById("modalOverlay").addEventListener("click", () => {
    document.getElementById("gerichtModal").style.display = "none";
  });


  // Gericht erfassen
  document.getElementById("gerichtForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const params = new URLSearchParams();


    params.append("datum", document.getElementById("gerichtDatum").value);
    params.append("name", document.getElementById("gerichtName").value.trim());
    params.append("description", document.getElementById("gerichtDesc").value.trim());
    checkboxes.forEach(cb => { if (cb.checked) params.append(cb.name, "1"); });


    try {
      const res = await fetch("/api/gericht_erfassen.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      const result = await res.json();


      if (result.status === "success") {
        document.getElementById("gerichtModal").style.display = "none";
        form.reset();
        loadWoche(); // Woche neu laden nach Erfassung
      } else {
        alert(result.message || "Fehler beim Erfassen.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Etwas ist schiefgelaufen.");
    }
  });


});