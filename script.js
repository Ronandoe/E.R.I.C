document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = sender;
        messageDiv.textContent = (sender === "user" ? "You: " : "E.R.I.C: ") + text;
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        appendMessage("user", message);
        userInput.value = "";

        try {
            const response = await fetch("https://e-r-i-c-backend.onrender.com/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            appendMessage("eric", data.reply || "No reply from E.R.I.C.");
        } catch (error) {
            appendMessage("eric", "Error communicating with E.R.I.C.");
        }
    }
});