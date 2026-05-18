// gerichte.js
async function loadGerichte() {
    try {
      const response = await fetch("api/gerichte.php", {
        method: "GET",
      });
      const result = await response.json();
  
      if (result.status === "success") {
        renderGerichte(result.data);
      } else {
        document.getElementById("gerichte-container").innerHTML =
          "<p>Fehler beim Laden der Daten.</p>";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("gerichte-container").innerHTML =
        "<p>Etwas ist schiefgelaufen.</p>";
    }
  }
  
  function renderGerichte(gerichte) {
    const container = document.getElementById("gerichte-container");
  
    if (gerichte.length === 0) {
      container.innerHTML = "<p>Keine Gerichte vorhanden.</p>";
      return;
    }
  
    container.innerHTML = gerichte
      .map((g) => {
        const total = g.total_bewertungen || 0;
        const goodPct = total > 0 ? Math.round((g.good / total) * 100) : 0;
        const neutralPct = total > 0 ? Math.round((g.neutral / total) * 100) : 0;
        const badPct = total > 0 ? Math.round((g.bad / total) * 100) : 0;
  
        return `
          <div class="gericht-card">
            <h2>${g.name}</h2>
            <p>${g.description}</p>
            <p><strong>Organisation:</strong> ${g.organisation}</p>
            <p><strong>Datum:</strong> ${g.date}</p>
            <div class="bewertung">
              <span class="good">👍 ${g.good} (${goodPct}%)</span>
              <span class="neutral">😐 ${g.neutral} (${neutralPct}%)</span>
              <span class="bad">👎 ${g.bad} (${badPct}%)</span>
              <span class="total">Total: ${total} Bewertungen</span>
            </div>
          </div>
        `;
      })
      .join("");
  }
  
  loadGerichte();