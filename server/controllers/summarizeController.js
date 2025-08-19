import { initDB } from "./../config/db.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in .env file");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
// Init DB
const db = await initDB();

const createSummarize = async (req, res) => {
  try 
  {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a text summarizer." },
        { role: "user", content: `Summarize the following:\n${text}` }
      ],
      max_tokens: 150
    });

    const summary = completion.choices[0].message.content.trim();
    
    db.run( "INSERT INTO summaries (original_text, summary) VALUES (?, ?)", [text, summary]);
    res.json({ summary });
  } 
  catch (err) 
  {
    console.error("OpenAI API Error:", err);
    res.status(500).json({ error: "Failed to summarize text" });
  }
}


const getAllSummarises = async(req, res) =>{

  try {
    const rows = await db.all("SELECT * FROM summaries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

export {
    getAllSummarises,
    createSummarize
}