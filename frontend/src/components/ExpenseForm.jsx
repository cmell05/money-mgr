import { useEffect, useState } from "react";

// income + expense categories
const incomeCategories = [
  "Salary",
  "Tax Return",
  "Scholarship",
  "Gift",
  "Bonus",
  "Reimbursement",
];

const expenseCategories = [
  "Food",
  "Groceries",
  "Transport",
  "Rent",
  "Utilities",
  "Clothes",
  "Entertainment",
  "Beauty",
  "Education",
  "Health",
  "Other",
];

export default function ExpenseForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    category: expenseCategories[0],
    note: "",
    type: "expense", // "income" or "expense"
  });

  // preload when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        date:
          initialData.date?.slice(0, 10) ||
          new Date().toISOString().slice(0, 10),
        amount: initialData.amount ?? "",
        category: initialData.category || expenseCategories[0],
        note: initialData.note || "",
        type: initialData.type || "expense",
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!form.amount || !form.date) {
      alert("Please enter amount and date");
      return;
    }

    console.log("📤 Submitting form:", form);

    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });

    if (!initialData) {
      setForm((prev) => ({
        ...prev,
        amount: "",
        note: "",
      }));
    }
  }

  const currentCategories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
      <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

      <div className="space-y-4">
        {/* Type toggle */}
        <div>
          <p className="text-sm text-slate-600 mb-2">Type</p>
          <div className="flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  type: "expense",
                  category: expenseCategories[0],
                }))
              }
              className={`flex-1 px-3 py-1 text-sm rounded-full transition-all ${
                form.type === "expense"
                  ? "bg-white shadow-sm text-rose-600"
                  : "text-slate-500"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  type: "income",
                  category: incomeCategories[0],
                }))
              }
              className={`flex-1 px-3 py-1 text-sm rounded-full transition-all ${
                form.type === "income"
                  ? "bg-white shadow-sm text-emerald-600"
                  : "text-slate-500"
              }`}
            >
              Income
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Current type: {form.type}</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="e.g. Groceries, monthly salary"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount
          </label>
          <div className="flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
            <span className="text-slate-400 mr-2">$</span>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {currentCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 transition"
          >
            {initialData
              ? "Save changes"
              : form.type === "income"
              ? "Add Income"
              : "Add Expense"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}