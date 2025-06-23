import { OpenAI } from "openai";
import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { user_input } = req.body;
  if (!user_input) {
    return res.status(400).json({ error: "Missing user_input" });
  }

  res.status(200).json({ message: "Ellis 4.0 Bridge online. Ready for full deployment." });
}