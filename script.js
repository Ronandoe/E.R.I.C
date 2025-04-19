document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("user-input");
  const log = document.getElementById("chat-log");

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function appendEntry(sender, message) {
    const entry = document.createElement("div");
    entry.className = sender;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  async function sendMessage() {
    const userMessage = input.value.trim();
    if (!userMessage) return;
    appendEntry("user", "You: " + userMessage);
    input.value = "";

    try {
      const response = await fetch("https://e-r-i-c-backend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      appendEntry("eric", "E.R.I.C: " + (data.reply || "No response received."));
    } catch (err) {
      appendEntry("eric", "E.R.I.C: Error reaching backend.");
    }
  }

  window.switchModule = function (module) {
    document.querySelectorAll(".module-window").forEach(win => win.classList.add("hidden"));
    const target = document.getElementById(`${module}-window`);
    if (target) target.classList.remove("hidden");
  }
});