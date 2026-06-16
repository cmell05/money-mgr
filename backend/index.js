const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Vite local development
  'http://127.0.0.1:5173',
  'http://localhost:4000',
  'https://money-mgr.vercel.app', // <-- 1. PRODUCTION FRONTEND 
  'https://money-mgr-git-income-by-categories-carmellas-projects.vercel.app', // <-- 2. The specific Vercel branch that was currently allowed
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allows the request if the origin is in the list or if it's not present (e.g., in a non-browser environment)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Apply the explicit CORS configuration
app.use(cors(corsOptions));
app.use(express.json());


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase backend client (secret key)
const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

if (!supabase) {
  console.warn(
    "Supabase is not configured. Authenticated transaction routes will return an error."
  );
}

async function requireAuth(req, res, next) {
  if (!supabase) {
    return res.status(500).json({
      error:
        "Authentication is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.",
    });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user;
  next();
}

// GET all expenses
app.get("/expenses", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ADD expense/income
app.post("/expenses", requireAuth, async (req, res) => {
  const { date, amount, category, note, type } = req.body;

  console.log("📥 Received POST request:", { date, amount, category, note, type });

  if (!date || !amount || !category) {
    return res.status(400).json({
      error: "date, amount, and category are required",
    });
  }

  const payload = {
    user_id: req.user.id,
    date,
    amount: Number(amount),
    category,
    note,
    type: type || "expense",
  };

  const { data, error } = await supabase
    .from("expenses")
    .insert([payload])
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
app.put("/expenses/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { date, amount, category, note, type } = req.body;

  console.log("📥 Received PUT request:", { id, date, amount, category, note, type });

  const payload = {
    date,
    amount: Number(amount),
    category,
    note,
    type: type || "expense",
  };

  const { data, error } = await supabase
    .from("expenses")
    .update(payload)
    .eq("id", id)
    .eq("user_id", req.user.id)
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
app.delete("/expenses/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Use PORT from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
