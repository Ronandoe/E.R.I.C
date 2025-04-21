
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("user-input");
  const log = document.getElementById("chat-log");

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) {
      console.log("Blocked empty or null message");
      return;
    }

    appendMessage("You", message);
    input.value = "";

    try {
      const response = await fetch("https://e-r-i-c-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      appendMessage("E.R.I.C", data.reply || "No response received.");
    } catch (err) {
      appendMessage("E.R.I.C", "Error reaching backend.");
    }
  }

  function appendMessage(sender, text) {
    const entry = document.createElement("div");
    entry.className = "message";
    entry.innerHTML = `<strong>${sender}:</strong> ${text}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  // Expose globally for Send button
  window.sendMessage = sendMessage;
});
