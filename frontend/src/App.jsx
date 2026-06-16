import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  LogOut,
  PiggyBank,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import ExpenseBreakdown from "./components/ExpenseBreakdown";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import AuthForm from "./components/AuthForm";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  setAuthToken,
  updateExpense,
} from "./api";
import { hasSupabaseConfig, supabase } from "./supabaseClient";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDateParts(date) {
  if (!date) return null;

  const [year, month] = String(date).slice(0, 10).split("-").map(Number);

  if (!year || !month) return null;

  return {
    year,
    monthIndex: month - 1,
  };
}

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthToken(data.session?.access_token);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthToken(nextSession?.access_token);
      setExpenses([]);
      setEditing(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadExpenses();
    }
  }, [session]);

  async function loadExpenses() {
    try {
      setLoading(true);
      const res = await getExpenses();
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(expense) {
    try {
      const res = await createExpense(expense);
      const newItem = Array.isArray(res.data) ? res.data[0] : res.data;
      setExpenses((prev) => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  }

  async function handleUpdate(expense) {
    if (!editing) return;

    try {
      const res = await updateExpense(editing.id, expense);
      const updated = Array.isArray(res.data) ? res.data[0] : res.data;
      setExpenses((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update transaction");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthToken(null);
    setSession(null);
    setExpenses([]);
    setEditing(null);
  }

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const dateParts = getDateParts(e.date);
      if (!dateParts) return false;

      return (
        dateParts.monthIndex === selectedMonth && dateParts.year === selectedYear
      );
    });
  }, [expenses, selectedMonth, selectedYear]);

  const totalIncome = monthlyExpenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalExpense = monthlyExpenses
    .filter((e) => e.type !== "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  const yearOptions = [];
  const baseYear = today.getFullYear();
  for (let y = baseYear - 3; y <= baseYear + 3; y++) {
    yearOptions.push(y);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <PiggyBank size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                MoneyMGR
              </h1>
              <p className="text-sm text-slate-500">
                Track and manage your expenses and income efficiently.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-sm text-slate-500">
              {session.user.email}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-4">
            <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-slate-100 text-slate-600 text-lg">
              <Calendar size={18} />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="h-9 rounded-full border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                className="h-9 rounded-full border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6 items-start">
          <ExpenseForm
            onSubmit={editing ? handleUpdate : handleAdd}
            initialData={editing}
            onCancel={() => setEditing(null)}
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Income</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    ${totalIncome.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Expenses</p>
                  <p className="text-xl font-semibold text-rose-500">
                    ${totalExpense.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Net Balance</p>
                  <p
                    className={`text-xl font-semibold ${
                      balance >= 0 ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {balance >= 0 ? "+" : "-"}$
                    {Math.abs(balance).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hidden lg:flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                  <Receipt size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Transactions</p>
                  <p className="text-xl font-semibold text-slate-700">
                    {monthlyExpenses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <ExpenseBreakdown
                transactions={monthlyExpenses}
                month={MONTHS[selectedMonth]}
                monthIndex={selectedMonth}
                year={selectedYear}
              />
            </div>
          </div>
        </div>

        <ExpenseTable
          expenses={monthlyExpenses}
          allCount={expenses.length}
          onEdit={(e) => setEditing(e)}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
