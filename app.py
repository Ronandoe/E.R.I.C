
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from memory_engine import log_entry, get_logs
import openai
import os

app = Flask(__name__)
CORS(app)

# Root route to confirm backend is live
@app.route("/")
def root():
    return "E.R.I.C. is online and ready."

# GPT Chat Endpoint
@app.route('/chat', methods=['POST'])
def chat():
    print(">> /chat endpoint hit")
    print("Request JSON:", request.json)

    messages = request.json.get("messages")
    mood = request.json.get("mood", None)

    if not messages:
        return jsonify({"error": "Missing 'messages' array"}), 400

    # Ensure system prompt is present
    if not any(msg["role"] == "system" for msg in messages):
        messages.insert(0, {
            "role": "system",
            "content": (
                "You are E.R.I.C., an emotionally aware diagnostic AI assistant. "
                "You respond with clarity, insight, and maintain a psychologically supportive tone. "
                "If the user expresses emotional distress, log the mood and respond supportively."
            )
        })

    # Remove malformed or null messages
    messages = [m for m in messages if m.get("content") and isinstance(m["content"], str)]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=500
        )
        reply = response['choices'][0]['message']['content']
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Log most recent user message + reply
    last_user_input = next((m["content"] for m in reversed(messages) if m["role"] == "user"), None)
    log_entry(
        entry_type="chat",
        content=(last_user_input or "") + " // Response: " + reply,
        mood=mood,
        folder="E.R.I.C. Conversations"
    )

    return jsonify({"response": reply})

# Mood log submission endpoint
@app.route('/log', methods=['POST'])
def receive_log():
    content = request.json.get('content')
    mood = request.json.get('mood')
    entry_type = request.json.get('type', 'mood_log')
    folder = request.json.get('folder', 'Ronan’s Psyche')
    result = log_entry(entry_type, content, mood, folder)
    return jsonify(result)

# View diagnostic log UI
@app.route("/psyche")
def psyche_ui():
    logs = get_logs()
    folders = sorted(set(log["folder"] for log in logs))
    return render_template("psyche.html", logs=logs, folders=folders)

if __name__ == "__main__":
    app.run(debug=True)

        print("OpenAI reply:", reply)

        # Log most recent user message + reply
        last_user_input = next((m["content"] for m in reversed(messages) if m["role"] == "user"), None)
        log_entry(
            entry_type="chat",
            content=(last_user_input or "") + " // Response: " + reply,
            mood=mood,
            folder="E.R.I.C. Conversations"
        )

        return jsonify({ "response": reply })

# Ensure the app runs on Render-compatible port
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
