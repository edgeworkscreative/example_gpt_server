// Storyline Trigger for Single Response Route
// This demonstrates the simplest form of ChatGPT interaction

var user_prompt = getVar("userprompt");
console.log("User prompt:", user_prompt);

async function openai_req() {
    fetch('http://127.0.0.1:5000/single-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "prompt": user_prompt })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response received:", data);

        if (data.success) {
            var gpt_content = data.data;
            gpt_content = gpt_content.trim();
            setVar("gptresponse", gpt_content);
            console.log("GPT Response:", gpt_content);
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
