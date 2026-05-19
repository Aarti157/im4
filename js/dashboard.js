window.addEventListener("load", () => {

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

    checkboxes.forEach((cb) => {
      if (cb.checked) params.append(cb.name, "1");
    });

    try {
      const response = await fetch("/api/gericht_erfassen.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      const result = await response.json();

      if (result.status === "success") {
        alert(`Gericht erfasst! ID: ${result.gericht_id}`);
        document.getElementById("gerichtModal").style.display = "none";
        form.reset();
      } else {
        alert(result.message || "Fehler beim Erfassen.");
      }  // ← diese } fehlte
    } catch (error) {
      console.error("Error:", error);
      alert("Etwas ist schiefgelaufen.");
    }
  });

});