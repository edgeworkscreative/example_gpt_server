const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { OpenAI } = require("openai");
 
const app = express();

// Configure CORS to allow requests from file:// protocol (for Storyline published content)
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        // or from file:// protocol (Storyline published content)
        if (!origin || origin === 'null') {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for development
        }
    },
    credentials: true
}));
app.use(express.json());
 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
 
app.get("/", async(req,res)=>{
    res.send("Hello World. Available endpoints: /single-response, /system-context, /conversation");
});

// Example 1: Single Response - Basic user prompt
app.post("/single-response", async(req,res)=>{
    try{
        const { prompt } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{
                "role": "user",
                "content": `${prompt}`,
            }],
            max_tokens: 500,
            temperature: 0.5,
            top_p: 1,
            frequency_penalty: 0.75,
            presence_penalty: 0,
        });
        return res.status(200).json({
            success: true,
            message: "Single response - basic user prompt",
            data: response.choices[0].message.content,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data: "There was a problem on the server",
        });
    }
});

// Example 2: System Context - Using system message to set behavior
app.post("/system-context", async(req,res)=>{
    try{
        const { prompt, systemContext } = req.body;

        // Default system context if none provided
        const defaultSystemContext = "You are a helpful coding instructor. Explain concepts clearly with examples.";

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": systemContext || defaultSystemContext,
                },
                {
                    "role": "user",
                    "content": `${prompt}`,
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        return res.status(200).json({
            success: true,
            message: "Response with system context",
            systemContextUsed: systemContext || defaultSystemContext,
            data: response.choices[0].message.content,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data: "There was a problem on the server",
        });
    }
});

// Example 3: Multi-step Conversation - Maintains conversation history
app.post("/conversation", async(req,res)=>{
    try{
        const { messages } = req.body;

        // Validate that messages array exists and has proper format
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                error: "Please provide a 'messages' array with conversation history",
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages, // Array of {role, content} objects
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.3,
        });
        return res.status(200).json({
            success: true,
            message: "Multi-step conversation response",
            data: response.choices[0].message.content,
            // Return the full conversation including the new response
            fullConversation: [...messages, response.choices[0].message],
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data: "There was a problem on the server",
        });
    }
});

 
const port = process.env.PORT || 5000;
 
app.listen(port, () => console.log(`Server listening on port ${port}`));
 
// app.listen(port, () => console.log(`Server listening on port ${port}`));