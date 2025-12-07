const ExpenseBreakdown = ({ transactions, month }) => {
  if (!transactions || !Array.isArray(transactions)) {
    return <p className="text-slate-400 text-center py-8">No data available</p>;
  }

  const categoryTotals = transactions
    .filter(t => t.type === 'expense' || t.type !== 'income')
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
    return <p className="text-slate-400 text-center py-8">No expenses to display for {month}</p>;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
      
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