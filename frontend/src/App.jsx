import { useEffect, useState, useMemo } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./api";
import ExpenseBreakdown from "./components/ExpenseBreakdown";
import { TrendingUp, TrendingDown, Wallet, Receipt, Calendar } from 'lucide-react';

// helper to get month name
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

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // month/year filter like in your Figma
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0–11
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

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

  useEffect(() => {
    loadExpenses();
  }, []);

  // filter by month/year for dashboard
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      if (Number.isNaN(d.getTime())) return false;
      return (
        d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
      );
    });
  }, [expenses, selectedMonth, selectedYear]);

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

  // summary numbers for current month
  const totalIncome = monthlyExpenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalExpense = monthlyExpenses
    .filter((e) => e.type !== "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  // simple year options (you can tweak)
  const yearOptions = [];
  const baseYear = today.getFullYear();
  for (let y = baseYear - 3; y <= baseYear + 3; y++) {
    yearOptions.push(y);
  }

  const currentMonthLabel = `${MONTHS[selectedMonth]} ${selectedYear}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Expense Tracker
          </h1>
          <p className="text-sm text-slate-500">
            Track and manage your expenses and income efficiently.
          </p>
        </div>
      </header>
      

      {/* Month / year selector bar (white pill like Figma) */}
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
        {/* Main grid: left form, right stats & "November expenses" card */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6 items-start">
          <ExpenseForm
            onSubmit={editing ? handleUpdate : handleAdd}
            initialData={editing}
            onCancel={() => setEditing(null)}
          />

          <div className="space-y-4">
            {/* Top summary cards (like Figma stats row) */}
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

            {/* "November Expenses" card (center area in Figma) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <ExpenseBreakdown transactions={monthlyExpenses} month={MONTHS[selectedMonth]} />
            </div>
          </div>
        </div>


        {/* Bottom card: recent transactions + category filter */}
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
