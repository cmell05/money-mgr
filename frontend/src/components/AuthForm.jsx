import { useState } from "react";
import { PiggyBank } from "lucide-react";
import { hasSupabaseConfig, supabase } from "../supabaseClient";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig) {
      setMessage("Supabase auth is not configured yet.");
      return;
    }

    try {
      setLoading(true);
      const { error } =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (mode === "signup") {
        setMessage("Account created. Check your email if confirmation is enabled.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <PiggyBank size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">MoneyMGR</h1>
            <p className="text-sm text-slate-500">
              {mode === "login" ? "Log in to your account" : "Create your account"}
            </p>
          </div>
        </div>

        {!hasSupabaseConfig && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Add <span className="font-semibold">VITE_SUPABASE_URL</span> and{" "}
            <span className="font-semibold">VITE_SUPABASE_ANON_KEY</span> to
            frontend/.env to enable login.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Minimum 6 characters"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !hasSupabaseConfig}
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 transition"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((current) => (current === "login" ? "signup" : "login"));
            setMessage("");
          }}
          className="mt-4 w-full text-sm text-slate-600 hover:text-slate-900"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
