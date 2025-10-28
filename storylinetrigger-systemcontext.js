// Storyline Trigger for System Context Route
// This demonstrates how to use system messages to control AI behavior

var user_prompt = getVar("userprompt");
var system_context = getVar("systemcontext"); // Optional: can be set in Storyline
console.log("User prompt:", user_prompt);
console.log("System context:", system_context);

async function openai_req() {
    // Prepare the request body
    var requestBody = {
        "prompt": user_prompt
    };

    // Add system context if provided, otherwise server will use default
    if (system_context && system_context !== "") {
        requestBody.systemContext = system_context;
    }

    fetch('http://127.0.0.1:5000/system-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response received:", data);

        if (data.success) {
            var gpt_content = data.data;
            gpt_content = gpt_content.trim();
            setVar("gptresponse", gpt_content);
            setVar("systemcontextused", data.systemContextUsed);
            console.log("GPT Response:", gpt_content);
            console.log("System context used:", data.systemContextUsed);
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
