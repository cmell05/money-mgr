# MoneyMGR 💰
A modern, full-stack expense tracking web application that helps users manage their finances efficiently. Track income and expenses with beautiful visualizations and intuitive categorization.

🔗 Live Demo: [money-mgr.vercel.app](https://money-mgr.vercel.app/)

---

## 🌟 Features

### **Frontend**

- 📊 Interactive Dashboard: Monthly income and expense summaries at a glance
- 📈 Visual Analytics: Category-based breakdown charts with toggle between income and expenses
- ✏️ Transaction Management: Add, edit, and delete transactions with ease
- 📅 Month/Year Filtering: View historical data and track spending trends
- 💳 Real-time Statistics: Cards showing total income, expenses, net balance, and transaction count
- 📱 Responsive Design: Optimized for desktop and mobile devices
- 🎨 Modern UI: Clean interface with Tailwind CSS and Lucide icons

### **Backend**

- 🔌 RESTful API: Clean API endpoints for transaction management
- 🗄️ PostgreSQL Database: Reliable data storage via Supabase
- ⚡ CRUD Operations: Full create, read, update, delete functionality
- 📊 Data Organization: Date-based filtering and smart categorization
- 🌐 CORS Enabled: Secure cross-origin requests


---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+) - [Download here](https://nodejs.org/)
- Supabase Account - [Sign up free](https://supabase.com/)
- Git - For cloning the repository



**Installation**
1. Clone the Repository
```sh
  bashgit clone https://github.com/yourusername/money-mgr.git
  cd money-mgr
  ```
2. Backend Setup
* Navigate to backend directory:
```sh
bashcd backend
npm install
```
* Create .env file in backend/ directory:
```sh
envPORT=4000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
* Get Supabase Credentials:
1. Go to supabase.com and create a project
2. Go to Settings → API
3. Copy Project URL and service_role key

* Create Database Table:
  
Run this SQL in Supabase SQL Editor:
```sh
sqlCREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  note TEXT,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```
* Start backend server:
```sh
bashnpm start
```
Backend runs at http://localhost:4000

3. Frontend Setup
* Navigate to frontend directory:
```sh
bashcd ../frontend
npm install
```
* Create .env file in frontend/ directory:
```sh
envVITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
* Start development server:
```sh
bashnpm run dev
```
Frontend runs at http://localhost:5173

---

## 🛠️ Built With
**Frontend:**
- React 19
- Vite (Build tool)
- Tailwind CSS
- Lucide React (Icons)
- Axios

**Backend:**
- Node.js
- Express.js
- Supabase (PostgreSQL)
- CORS

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Supabase

---
    
## 📖 How to Use
1. **Add a Transaction** 
- Select transaction type (Expense or Income)
- Enter description (e.g., "Grocery shopping")
- Input amount (e.g., 50.00)
- Choose category from dropdown
- Select date
- Click "Save changes"

2. **View Dashboard**

- Use month and year selectors to filter transactions. 
- View summary cards showing:
- Total Income: All income for selected month
- Total Expenses: All spending for selected month
- Net Balance: Income minus expenses
- Transactions: Total number of transactions
- Toggle between Expense and Income views in analytics

3. **Manage Transactions**

- Click edit icon ✏️ to modify any transaction
- Click delete icon 🗑️ to remove a transaction
- View all transactions in table below the dashboard

4. **Analyze Spending**

- Click Expenses or Income toggle in chart section
- See category breakdown with percentages
- View visual bar charts showing distribution
- Identify which categories consume most budget



