const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

window.addEventListener("load", async () => {

  // ── User laden ──
  try {
    const res = await fetch("/api/protected.php", { credentials: "include" });
    if (res.status === 401) { window.location.href = "/login.html"; return; }
    const data = await res.json();
    document.getElementById("userName").textContent = data.name || data.email;
    document.getElementById("userOrga").textContent = data.organisation || "";
  } catch (e) {
    window.location.href = "/login.html";
  }

  // ── Wochenübersicht laden ──
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
        const datumLabel = datum.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit" });
        const gericht = result.data.find(g => g.date === datumStr);

        if (!gericht) {
          return `
            <div class="tag-karte leer">
              <div class="tag-header">
                <span class="tag-label">${tag}</span>
                <span class="tag-datum">${datumLabel}</span>
              </div>
              <div class="kein-gericht">Noch kein Gericht erfasst</div>
            </div>`;
        }

        const total = (gericht.good || 0) + (gericht.neutral || 0) + (gericht.bad || 0);
        const pGood    = total ? Math.round((gericht.good    || 0) / total * 100) : 0;
        const pNeutral = total ? Math.round((gericht.neutral || 0) / total * 100) : 0;
        const pBad     = total ? 100 - pGood - pNeutral : 0;

        const badgeMap = { vegan: "vg", vegetarisch: "v", pescetarisch: "p", glutenfrei: "gf", laktosefrei: "lf", zuckerfrei: "zf", sojafrei: "sf" };
        const badges = Object.entries(badgeMap)
          .filter(([key]) => gericht[key])
          .map(([, label]) => `<span class="gbadge">${label}</span>`).join("");

        return `
          <div class="tag-karte" data-datum="${datumStr}">
            <div class="tag-header">
              <span class="tag-label">${tag}</span>
              <span class="tag-datum">${datumLabel}</span>
            </div>
            <div class="gericht-name">${gericht.name}</div>
            ${gericht.description ? `<div class="gericht-desc">${gericht.description}</div>` : ""}
            ${badges ? `<div class="gericht-badges">${badges}</div>` : ""}
            <div class="bewertung-bar">
              <div class="bar-track">
                <div class="bar-pink"  style="width:${pGood}%"></div>
                <div class="bar-blue"  style="width:${pNeutral}%"></div>
                <div class="bar-sand"  style="width:${pBad}%"></div>
              </div>
              <div class="bar-labels">
                <span class="bar-label">😊 ${gericht.good || 0}</span>
                <span class="bar-label">😐 ${gericht.neutral || 0}</span>
                <span class="bar-label">😕 ${gericht.bad || 0}</span>
              </div>
            </div>
          </div>`;
      }).join("");
    } catch (e) {
      document.getElementById("wocheContainer").innerHTML =
        '<p style="color:#c0392b;font-size:.85rem;">Fehler beim Laden der Wochendaten.</p>';
    }
  }

  loadWoche();

  // ── Klick auf Tageskarte → Bewertungs-Modal ──
  document.getElementById("wocheContainer").addEventListener("click", async (e) => {
    const karte = e.target.closest("[data-datum]");
    if (!karte) return;
    const datum = karte.dataset.datum;
    try {
      const res = await fetch(`/api/gerichte.php?datum=${datum}`, { credentials: "include" });
      const result = await res.json();
      const d = result.data;
      document.getElementById("bewertungDatum").textContent   = datum;
      document.getElementById("bewertungGood").textContent    = d?.good    || 0;
      document.getElementById("bewertungNeutral").textContent = d?.neutral || 0;
      document.getElementById("bewertungBad").textContent     = d?.bad     || 0;
      document.getElementById("bewertungTotal").textContent   = d?.total_bewertungen || 0;
      document.getElementById("bewertungModal").classList.add("open");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Laden der Bewertungen.");
    }
  });

  // ── Bewertungs-Modal schliessen ──
  document.getElementById("bewertungModalClose").addEventListener("click", () => {
    document.getElementById("bewertungModal").classList.remove("open");
  });
  document.getElementById("bewertungModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("bewertungModal"))
      document.getElementById("bewertungModal").classList.remove("open");
  });

  // ── Gericht erfassen ──
  document.getElementById("gerichtForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const params = new URLSearchParams();
    params.append("datum",       document.getElementById("gerichtDatum").value);
    params.append("name",        document.getElementById("gerichtName").value.trim());
    params.append("description", document.getElementById("gerichtDesc").value.trim());
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.checked) params.append(cb.name, "1");
    });
    try {
      const res = await fetch("/api/gericht_erfassen.php", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      const result = await res.json();
      if (result.status === "success") {
        form.reset();
        loadWoche();
      } else {
        alert(result.message || "Fehler beim Erfassen.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Etwas ist schiefgelaufen.");
    }
  });

});