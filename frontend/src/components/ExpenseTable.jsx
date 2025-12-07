import { useMemo, useState } from "react";

const ALL_CATEGORIES = "All Categories";

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  loading,
  allCount,
}) {
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);

  const categories = useMemo(
    () =>
      Array.from(new Set(expenses.map((e) => e.category))).sort(
        (a, b) => a?.localeCompare(b ?? "") ?? 0
      ),
    [expenses]
  );

  const visibleExpenses =
    categoryFilter === ALL_CATEGORIES
      ? expenses
      : expenses.filter((e) => e.category === categoryFilter);

  const totalIncome = visibleExpenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalExpense = visibleExpenses
    .filter((e) => e.type !== "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6 space-y-4">
      {/* Header row: title + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Recent Transactions</h2>
          {typeof allCount === "number" && (
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {visibleExpenses.length} of {allCount} transactions for
              this month
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Filter:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-full border border-slate-200 px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary mini-row (like “Income / Exp. / Net”) */}
      <div className="flex flex-wrap gap-6 text-xs">
        <div>
          <p className="text-slate-500">Income</p>
          <p className="font-semibold text-emerald-600">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Expenses</p>
          <p className="font-semibold text-rose-500">
            ${totalExpense.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Net</p>
          <p
            className={`font-semibold ${
              balance >= 0 ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {balance >= 0 ? "+" : "-"}${Math.abs(balance).toFixed(2)}
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Loading transactions…</p>
      )}

      {!loading && visibleExpenses.length === 0 && (
        <p className="text-sm text-slate-500">
          No transactions yet. Add one on the left.
        </p>
      )}

      {/* Transaction list – styled like Figma */}
      <div className="space-y-3">
        {visibleExpenses.map((e) => {
          const isIncome = e.type === "income";

          return (
            <div
              key={e.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                isIncome
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-rose-50 border-rose-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-lg ${
                    isIncome
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-rose-100 text-rose-500"
                  }`}
                >
                  {isIncome ? "📈" : "📉"}
                </div>

                <div>
                  <p className="font-medium">
                    {e.note || (isIncome ? "Income" : "Expense")}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 border border-slate-200">
                      <span className="mr-1">🏷️</span>
                      {e.category || "Uncategorized"}
                    </span>
                    {e.date && (
                      <>
                        <span>•</span>
                        <span>{e.date.slice(0, 10)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={`font-semibold ${
                    isIncome ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {isIncome ? "+" : "-"}$
                  {Number(e.amount || 0).toFixed(2)}
                </p>

                <button
                  onClick={() => onEdit(e)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(e.id)}
                  className="text-xs text-rose-500 hover:text-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
