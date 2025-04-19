
async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const log = document.getElementById("chat-log");
  const entry = document.createElement("div");
  entry.className = "chat-entry user";
  entry.textContent = message;
  log.appendChild(entry);

  input.value = "";

  const response = await fetch("https://e-r-i-c-backend.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  const reply = document.createElement("div");
  reply.className = "chat-entry ai";
  reply.textContent = data.response || "No response";
  log.appendChild(reply);
}

function switchModule(module) {
  document.querySelectorAll(".module-window").forEach(win => win.classList.add("hidden"));
  document.getElementById(`${module}-window`).classList.remove("hidden");
}
