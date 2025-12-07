import { useState } from 'react';

const ExpenseBreakdown = ({ transactions, month }) => {
  const [viewType, setViewType] = useState('expense'); // 'expense' or 'income'

  if (!transactions || !Array.isArray(transactions)) {
    return <p className="text-slate-400 text-center py-8">No data available</p>;
  }

  // Group transactions by category based on viewType
  const categoryTotals = transactions
    .filter(t => viewType === 'expense' ? (t.type === 'expense' || t.type !== 'income') : t.type === 'income')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(transaction.amount || 0);
      return acc;
    }, {});

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  if (chartData.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">By Category</h3>
          <div className="inline-flex rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setViewType('expense')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'expense'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setViewType('income')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Income
            </button>
          </div>
        </div>
        <p className="text-slate-400 text-center py-8">
          No {viewType === 'expense' ? 'expenses' : 'income'} to display for {month}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {viewType === 'expense' ? 'Expenses' : 'Income'} by Category
        </h3>
        
        {/* Toggle Button */}
        <div className="inline-flex rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setViewType('expense')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewType === 'expense'
                ? 'bg-rose-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setViewType('income')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewType === 'income'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Income
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {chartData.map((category, index) => {
          const percentage = ((category.value / total) * 100).toFixed(1);
          return (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <span className="text-sm text-slate-600">${category.value.toFixed(2)} ({percentage}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseBreakdown;