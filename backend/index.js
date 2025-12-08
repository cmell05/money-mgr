const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

dotenv.config();

const app = express();

// Update CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Supabase backend client (secret key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate unique session ID
function generateSessionId() {
  return crypto.randomUUID();
}

// GET session ID or create new one
app.get("/session", (req, res) => {
  const sessionId = generateSessionId();
  res.json({ sessionId });
});

// GET all expenses for a session
app.get("/expenses", async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", sessionId)
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ADD expense/income
app.post("/expenses", async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { date, amount, category, note, type } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  console.log("📥 Received POST request:", { sessionId, date, amount, category, note, type });

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        user_id: sessionId,
        date,
        amount,
        category,
        note,
        type: type || "expense",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ Insert error:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("✅ Inserted data:", data);
  res.status(201).json(data);
});

// EDIT expense/income
app.put("/expenses/:id", async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { id } = req.params;
  const { date, amount, category, note, type } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  console.log("📥 Received PUT request:", { sessionId, id, date, amount, category, note, type });

  const { data, error } = await supabase
    .from("expenses")
    .update({ 
      date, 
      amount, 
      category, 
      note,
      type: type || "expense",
    })
    .eq("id", id)
    .eq("user_id", sessionId)
    .select()
    .single();

  if (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("✅ Updated data:", data);
  res.json(data);
});

// DELETE expense
app.delete("/expenses/:id", async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { id } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID required" });
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", sessionId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Use PORT from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});