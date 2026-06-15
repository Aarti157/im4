// register.js

function updateOrgaField() {
  const rollen_id = document.querySelector('input[name="rollen_id"]:checked').value;
  const orgaSelect = document.getElementById("orga_id");
  const orgaWrap   = document.querySelector(".field-orga");

  if (rollen_id === "1") {
    orgaSelect.disabled = true;
    orgaSelect.value    = "";
    orgaWrap.style.opacity = "0.4";
    orgaWrap.style.pointerEvents = "none";
  } else {
    orgaSelect.disabled = false;
    orgaWrap.style.opacity = "1";
    orgaWrap.style.pointerEvents = "auto";
  }
}

document.querySelectorAll('input[name="rollen_id"]').forEach(radio => {
  radio.addEventListener("change", updateOrgaField);
});
updateOrgaField();

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email     = document.getElementById("email").value.trim();
    const name      = document.getElementById("name").value.trim();
    const password  = document.getElementById("password").value.trim();
    const rollen_id = document.querySelector('input[name="rollen_id"]:checked').value;
    const orga_id   = document.getElementById("orga_id").disabled
      ? ""
      : document.getElementById("orga_id").value;

    try {
      const response = await fetch("api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password, name, rollen_id, orga_id }),
      });
      const result = await response.json();

      if (result.status === "success") {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  });