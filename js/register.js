// register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();
    const rollen_id = document.getElementById("rollen_id").value;
    const orga_id = document.getElementById("orga_id").value;

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
