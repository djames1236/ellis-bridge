const axios = require('axios');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { user_input } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: user_input }],
      tools: [
        {
          type: "function",
          function: {
            name: "schedule_event",
            description: "Schedules a calendar event",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                description: { type: "string" },
                year: { type: "integer" },
                month: { type: "integer" },
                day: { type: "integer" },
                hour: { type: "integer" },
                minute: { type: "integer" },
                duration: { type: "integer" }
              },
              required: ["summary", "year", "month", "day", "hour", "minute", "duration"]
            }
          }
        }
      ],
      tool_choice: "auto"
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];

    if (toolCall?.function?.name === "schedule_event") {
      const payload = JSON.parse(toolCall.function.arguments);
      await axios.post(process.env.MAKE_WEBHOOK_URL, payload);
      return res.status(200).json({ message: "✅ Event submitted." });
    } else {
      return res.status(200).json({ message: "No function call made." });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Function failed", error: error.message });
  }
};