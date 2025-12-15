const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

// Allow all Vercel and localhost
app.use(cors());
app.use(express.json());

// Supabase backend client (secret key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// TEMP fake user ID
const FAKE_USER_ID = "00000000-0000-0000-0000-000000000001";

// GET all expenses
app.get("/expenses", async (req, res) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", FAKE_USER_ID)
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ADD expense/income
app.post("/expenses", async (req, res) => {
  const { date, amount, category, note, type } = req.body;

  console.log("📥 Received POST request:", { date, amount, category, note, type });

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        user_id: FAKE_USER_ID,
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
  const { id } = req.params;
  const { date, amount, category, note, type } = req.body;

  console.log("📥 Received PUT request:", { id, date, amount, category, note, type });

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
    .eq("user_id", FAKE_USER_ID)
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
  const { id } = req.params;

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", FAKE_USER_ID);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Use PORT from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});