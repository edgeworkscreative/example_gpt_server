// Storyline Trigger for Conversation Route
// This demonstrates multi-step conversations with context

var user_prompt = getVar("userprompt");
var conversation_history = getVar("conversationhistory"); // JSON string of message array
console.log("User prompt:", user_prompt);
console.log("Conversation history:", conversation_history);

async function openai_req() {
    var messages = [];

    // If there's existing conversation history, parse it
    if (conversation_history && conversation_history !== "") {
        try {
            messages = JSON.parse(conversation_history);
        } catch (e) {
            console.error("Error parsing conversation history:", e);
            // Start fresh if parsing fails
            messages = [];
        }
    }

    // If no history exists, start with a system message
    if (messages.length === 0) {
        messages.push({
            "role": "system",
            "content": "You are a helpful coding instructor. Explain concepts clearly with examples."
        });
    }

    // Add the new user message
    messages.push({
        "role": "user",
        "content": user_prompt
    });

    fetch('http://127.0.0.1:5000/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "messages": messages })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response received:", data);

        if (data.success) {
            var gpt_content = data.data;
            gpt_content = gpt_content.trim();
            setVar("gptresponse", gpt_content);

            // Save the updated conversation history for next interaction
            var updated_conversation = JSON.stringify(data.fullConversation);
            setVar("conversationhistory", updated_conversation);

            console.log("GPT Response:", gpt_content);
            console.log("Conversation turn:", data.fullConversation.length);
        } else {
            console.error("Error in response:", data.error);
            setVar("gptresponse", "Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        setVar("gptresponse", "Error: Unable to connect to server");
    });
}

openai_req();
