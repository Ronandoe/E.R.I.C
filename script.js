
async function sendMessage() {
    const input = document.getElementById('user-input');
    const log = document.getElementById('chat-log');
    const userMessage = input.value;
    if (!userMessage.trim()) return;

    // Display user message
    const userEntry = document.createElement('div');
    userEntry.className = 'chat-entry user';
    userEntry.textContent = userMessage;
    log.appendChild(userEntry);
    input.value = '';

    // Display loading animation
    const botEntry = document.createElement('div');
    botEntry.className = 'chat-entry bot';
    botEntry.innerHTML = '<span class="dot-flash"></span>';
    log.appendChild(botEntry);
    log.scrollTop = log.scrollHeight;

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: userMessage})
        });
        const data = await response.json();
        botEntry.textContent = data.reply || 'No response received.';
    } catch (error) {
        botEntry.textContent = 'Error connecting to AI.';
        console.error(error);
    }

    log.scrollTop = log.scrollHeight;
}
