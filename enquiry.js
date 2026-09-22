(() => {
  const form = document.querySelector(".enquiry");
  if (!form) return;

  const status = document.createElement("p");
  status.className = "enquiry__status";
  status.setAttribute("aria-live", "polite");
  form.appendChild(status);

  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("enquiry__status--ok", "enquiry__status--err");

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
      honey: String(data.get("_honey") || "").trim(),
    };

    if (submit) submit.disabled = true;

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Could not send.");
      }

      form.reset();
      status.textContent = "Sent — thank you.";
      status.classList.add("enquiry__status--ok");
    } catch (error) {
      status.textContent =
        error instanceof Error ? error.message : "Could not send.";
      status.classList.add("enquiry__status--err");
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();
