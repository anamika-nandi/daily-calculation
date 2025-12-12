# Poultry Farm Management System
## Product Requirements Document (PRD)

**Version:** 1.0
**Date:** December 12, 2025
**Status:** In Development

---

## 1. Executive Summary

A web-based application for poultry farm management that enables daily tracking of egg stock, feed stock, and bird inventory across 5 locations (L1, L2, L3, L4, C-Chick shed). The system features automatic calculations, a comprehensive dashboard, and reporting capabilities with export functionality.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MongoDB with Mongoose ODM |
| Backend | Express.js with JWT Authentication |
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| API | RESTful Architecture |

---

## 3. Core Features

### 3.1 User Authentication
- Single user login system
- JWT-based authentication
- Protected routes

### 3.2 Egg Stock Management
- Track across 5 locations: L1, L2, L3, L4, C
- **Fields:** Opening, Production, Sell, Closing
- **Auto-calculation:** `Closing = Opening + Production - Sell`
- **Auto-populate:** Opening = Previous day's Closing

### 3.3 Feed Stock Management
- Track across 5 locations: L1, L2, L3, L4, C
- **Fields:** Opening, Received, Used, Closing
- **Auto-calculation:** `Closing = Opening + Received - Used`
- **Auto-populate:** Opening = Previous day's Closing

### 3.4 Birds Stock Management
- Track across 5 locations: L1, L2, L3, L4, C
- **Fields:** Age (weeks), Previous Total, Mortality, Culled, Added, Total Birds, Eggs Produced, Production %
- **Auto-calculation:**
  - `Total Birds = Previous Total - Mortality - Culled + Added`
  - `Production % = (Eggs Produced / Total Birds) * 100`
- **Auto-populate:** Previous Total and Age from previous day

### 3.5 Dashboard
- Summary cards for key metrics
- Location overview grid
- Quick entry widget for fast data input

### 3.6 Reporting
- Historical data view with date filters
- Trend charts (production, mortality, stock levels)
- Export to Excel and PDF

---

## 4. Development Phases

---

### Phase 1: Foundation & Authentication
**Objective:** Set up database, authentication, and basic project structure

#### Backend Tasks
| # | Task | File |
|---|------|------|
| 1 | Install dependencies | `backend/package.json` |
| 2 | Create MongoDB connection | `backend/config/database.js` |
| 3 | Create User model with password hashing | `backend/models/User.js` |
| 4 | Create JWT auth middleware | `backend/middleware/auth.js` |
| 5 | Create error handler middleware | `backend/middleware/errorHandler.js` |
| 6 | Create auth routes | `backend/routes/auth.js` |
| 7 | Create auth controller | `backend/controllers/authController.js` |
| 8 | Update server.js with routes | `backend/server.js` |
| 9 | Create environment config | `backend/.env` |
| 10 | Create seed script for admin user | `backend/scripts/seed.js` |

#### Frontend Tasks
| # | Task | File |
|---|------|------|
| 1 | Install dependencies | `frontend/package.json` |
| 2 | Create auth context | `frontend/src/context/AuthContext.jsx` |
| 3 | Create API client with interceptors | `frontend/src/api/client.js` |
| 4 | Create auth API functions | `frontend/src/api/auth.js` |
| 5 | Create Login page | `frontend/src/pages/Login.jsx` |
| 6 | Set up React Router | `frontend/src/App.jsx` |
| 7 | Create Layout component | `frontend/src/components/layout/Layout.jsx` |
| 8 | Create Header component | `frontend/src/components/layout/Header.jsx` |
| 9 | Create Sidebar component | `frontend/src/components/layout/Sidebar.jsx` |
| 10 | Add QueryClientProvider | `frontend/src/main.jsx` |

#### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | User logout |

#### Deliverables
- Working login/logout functionality
- Protected routes
- MongoDB connected

---

### Phase 2: Egg Stock Module
**Objective:** Complete egg stock tracking functionality

#### Backend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create EggStock model | `backend/models/EggStock.js` |
| 2 | Create egg routes | `backend/routes/eggs.js` |
| 3 | Create egg controller | `backend/controllers/eggController.js` |
| 4 | Add routes to server.js | `backend/server.js` |

#### Frontend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create EggStock page | `frontend/src/pages/EggStock.jsx` |
| 2 | Create EggStockForm component | `frontend/src/components/forms/EggStockForm.jsx` |
| 3 | Create EggStockTable component | `frontend/src/components/tables/EggStockTable.jsx` |
| 4 | Create useEggStock hooks | `frontend/src/hooks/useEggStock.js` |
| 5 | Create eggs API functions | `frontend/src/api/eggs.js` |
| 6 | Create Input UI component | `frontend/src/components/ui/input.jsx` |
| 7 | Create Label UI component | `frontend/src/components/ui/label.jsx` |
| 8 | Create Tabs UI component | `frontend/src/components/ui/tabs.jsx` |

#### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/eggs/today` | Get today's records |
| GET | `/api/eggs/date/:date` | Get by specific date |
| GET | `/api/eggs/opening/:date/:location` | Get opening stock |
| POST | `/api/eggs` | Create/update record |
| PUT | `/api/eggs/:id` | Update record |
| DELETE | `/api/eggs/:id` | Delete record |

#### Deliverables
- Enter daily egg data for all 5 locations
- Opening stock auto-populates
- Closing automatically calculated

---

### Phase 3: Feed Stock Module
**Objective:** Complete feed stock tracking functionality

#### Backend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create FeedStock model | `backend/models/FeedStock.js` |
| 2 | Create feed routes | `backend/routes/feed.js` |
| 3 | Create feed controller | `backend/controllers/feedController.js` |
| 4 | Add routes to server.js | `backend/server.js` |

#### Frontend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create FeedStock page | `frontend/src/pages/FeedStock.jsx` |
| 2 | Create FeedStockForm component | `frontend/src/components/forms/FeedStockForm.jsx` |
| 3 | Create FeedStockTable component | `frontend/src/components/tables/FeedStockTable.jsx` |
| 4 | Create useFeedStock hooks | `frontend/src/hooks/useFeedStock.js` |
| 5 | Create feed API functions | `frontend/src/api/feed.js` |

#### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feed/today` | Get today's records |
| GET | `/api/feed/date/:date` | Get by specific date |
| GET | `/api/feed/opening/:date/:location` | Get opening stock |
| POST | `/api/feed` | Create/update record |
| PUT | `/api/feed/:id` | Update record |
| DELETE | `/api/feed/:id` | Delete record |

#### Deliverables
- Track feed received and consumption
- Auto-calculated closing stock

---

### Phase 4: Birds Stock Module
**Objective:** Complete bird inventory and mortality tracking

#### Backend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create BirdStock model | `backend/models/BirdStock.js` |
| 2 | Create birds routes | `backend/routes/birds.js` |
| 3 | Create birds controller | `backend/controllers/birdController.js` |
| 4 | Add routes to server.js | `backend/server.js` |

#### Frontend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create BirdStock page | `frontend/src/pages/BirdStock.jsx` |
| 2 | Create BirdStockForm component | `frontend/src/components/forms/BirdStockForm.jsx` |
| 3 | Create BirdStockTable component | `frontend/src/components/tables/BirdStockTable.jsx` |
| 4 | Create useBirdStock hooks | `frontend/src/hooks/useBirdStock.js` |
| 5 | Create birds API functions | `frontend/src/api/birds.js` |

#### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/birds/today` | Get today's records |
| GET | `/api/birds/date/:date` | Get by specific date |
| GET | `/api/birds/previous/:date/:location` | Get previous day data |
| POST | `/api/birds` | Create/update record |
| PUT | `/api/birds/:id` | Update record |
| DELETE | `/api/birds/:id` | Delete record |

#### Deliverables
- Track bird counts and mortality
- Age tracking in weeks
- Production percentage calculated

---

### Phase 5: Dashboard
**Objective:** Create comprehensive overview dashboard

#### Backend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create reports routes | `backend/routes/reports.js` |
| 2 | Create reports controller | `backend/controllers/reportController.js` |
| 3 | Add routes to server.js | `backend/server.js` |

#### Frontend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create Dashboard page | `frontend/src/pages/Dashboard.jsx` |
| 2 | Create SummaryCards component | `frontend/src/components/dashboard/SummaryCards.jsx` |
| 3 | Create LocationOverview component | `frontend/src/components/dashboard/LocationOverview.jsx` |
| 4 | Create QuickEntryWidget component | `frontend/src/components/dashboard/QuickEntryWidget.jsx` |
| 5 | Create useReports hooks | `frontend/src/hooks/useReports.js` |
| 6 | Create reports API functions | `frontend/src/api/reports.js` |

#### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/summary` | Dashboard summary |
| GET | `/api/reports/today` | Today's quick stats |

#### Deliverables
- At-a-glance view of all farm metrics
- Quick entry without navigating to full forms

---

### Phase 6: Reporting & Export
**Objective:** Implement reporting with charts and export capability

#### Backend Tasks
| # | Task | File |
|---|------|------|
| 1 | Install exceljs and pdfkit | `backend/package.json` |
| 2 | Add trend calculation endpoints | `backend/controllers/reportController.js` |
| 3 | Create Excel export endpoint | `backend/controllers/reportController.js` |
| 4 | Create PDF export endpoint | `backend/controllers/reportController.js` |
| 5 | Update reports routes | `backend/routes/reports.js` |

#### Frontend Tasks
| # | Task | File |
|---|------|------|
| 1 | Create Reports page | `frontend/src/pages/Reports.jsx` |
| 2 | Create ProductionChart component | `frontend/src/components/charts/ProductionChart.jsx` |
| 3 | Create MortalityChart component | `frontend/src/components/charts/MortalityChart.jsx` |
| 4 | Create StockTrendChart component | `frontend/src/components/charts/StockTrendChart.jsx` |
| 5 | Create DateRangePicker component | `frontend/src/components/ui/date-picker.jsx` |
| 6 | Add export functionality | `frontend/src/pages/Reports.jsx` |

#### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/trends` | Chart data with date filters |
| GET | `/api/reports/export/excel` | Download Excel file |
| GET | `/api/reports/export/pdf` | Download PDF file |

#### Deliverables
- View historical data with filters
- Visual trend charts
- Export data to Excel and PDF

---

### Phase 7: Mobile Optimization & Polish
**Objective:** Mobile optimization and UX improvements

#### Tasks
| # | Task | File |
|---|------|------|
| 1 | Create MobileNav component | `frontend/src/components/layout/MobileNav.jsx` |
| 2 | Add responsive styles | All pages |
| 3 | Create Toast component | `frontend/src/components/ui/toast.jsx` |
| 4 | Add loading states | All pages |
| 5 | Add form validation feedback | All forms |
| 6 | Performance optimization | All components |

#### Deliverables
- Mobile-friendly interface
- Smooth user experience
- Clear feedback for all actions

---

## 5. Database Schema

### User
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['admin', 'manager']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### EggStock
```javascript
{
  date: Date (required, indexed),
  location: String (enum: ['L1', 'L2', 'L3', 'L4', 'C']),
  opening: Number (min: 0),
  production: Number (min: 0),
  sell: Number (min: 0),
  closing: Number (auto-calculated),
  notes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index: { date, location }
```

### FeedStock
```javascript
{
  date: Date (required, indexed),
  location: String (enum: ['L1', 'L2', 'L3', 'L4', 'C']),
  opening: Number (min: 0),
  received: Number (min: 0),
  used: Number (min: 0),
  closing: Number (auto-calculated),
  feedType: String (enum: ['layer', 'grower', 'starter', 'finisher']),
  notes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index: { date, location, feedType }
```

### BirdStock
```javascript
{
  date: Date (required, indexed),
  location: String (enum: ['L1', 'L2', 'L3', 'L4', 'C']),
  ageWeeks: Number (min: 0),
  previousTotal: Number (min: 0),
  mortality: Number (min: 0),
  culled: Number (min: 0),
  added: Number (min: 0),
  totalBirds: Number (auto-calculated),
  eggsProduced: Number (min: 0),
  productionPercent: Number (auto-calculated),
  notes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index: { date, location }
```

---

## 6. Project Structure

```
daily-calculation/
├── PRD.md                    # This file
├── package.json              # Root package.json
├── backend/
│   ├── server.js             # Main Express app
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Environment variables
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── EggStock.js
│   │   ├── FeedStock.js
│   │   └── BirdStock.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── eggs.js
│   │   ├── feed.js
│   │   ├── birds.js
│   │   └── reports.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eggController.js
│   │   ├── feedController.js
│   │   ├── birdController.js
│   │   └── reportController.js
│   └── scripts/
│       └── seed.js           # Admin user seed
│
└── frontend/
    ├── package.json          # Frontend dependencies
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx          # Entry with providers
        ├── App.jsx           # Root with Router
        ├── index.css         # Global styles
        ├── api/
        │   ├── client.js     # Axios instance
        │   ├── auth.js
        │   ├── eggs.js
        │   ├── feed.js
        │   ├── birds.js
        │   └── reports.js
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useEggStock.js
        │   ├── useFeedStock.js
        │   ├── useBirdStock.js
        │   └── useReports.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── ui/           # Reusable UI components
        │   ├── layout/       # Layout components
        │   ├── forms/        # Form components
        │   ├── tables/       # Table components
        │   ├── charts/       # Chart components
        │   └── dashboard/    # Dashboard widgets
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── EggStock.jsx
        │   ├── FeedStock.jsx
        │   ├── BirdStock.jsx
        │   └── Reports.jsx
        └── lib/
            ├── utils.js      # Utility functions
            └── constants.js  # Constants
```

---

## 7. Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/poultry-farm
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 8. Dependencies

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "exceljs": "^4.4.0",
    "pdfkit": "^0.14.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.2",
    "recharts": "^2.10.3",
    "date-fns": "^3.0.6",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.312.0"
  }
}
```

---

## 9. Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application
```bash
# From root directory
npm run dev
```

### Default Admin Credentials
- Username: `admin`
- Password: `admin123` (change after first login)

---

## 10. Calculation Formulas Reference

| Module | Formula |
|--------|---------|
| Egg Stock | `Closing = Opening + Production - Sell` |
| Feed Stock | `Closing = Opening + Received - Used` |
| Bird Stock - Total | `Total Birds = Previous Total - Mortality - Culled + Added` |
| Bird Stock - Production % | `Production % = (Eggs Produced / Total Birds) * 100` |

---

## 11. Locations

| Code | Description |
|------|-------------|
| L1 | Layer Shed 1 |
| L2 | Layer Shed 2 |
| L3 | Layer Shed 3 |
| L4 | Layer Shed 4 |
| C | Chick Shed |
