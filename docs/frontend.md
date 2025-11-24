# Budget Tracker - Frontend Application Specification

## Project Overview

Build a **stunning, modern** Next.js web application for the Budget Tracker API featuring immersive 3D visuals, smooth animations, and comprehensive financial management capabilities.

---

## Technology Stack

### Core Framework
- **Next.js 14+** (App Router)
- **TypeScript** for type safety
- **React 18+**

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **Lucide React** for icons

### Animations & 3D
- **Framer Motion** for smooth UI animations and transitions
- **Three.js + React Three Fiber** for 3D graphics
- **Three Drei** for Three.js helpers
- **GSAP** for advanced scroll animations
- **Lenis** for smooth scrolling

### State Management & Data Fetching
- **TanStack Query (React Query)** for server state
- **Zustand** for client state
- **Axios** for API calls

### Visualization
- **Recharts** or **Chart.js** for financial charts
- **React-Calendar-Heatmap** for spending heatmap

### Authentication
- **NextAuth.js** for authentication
- **JWT** token management

---

## Project Structure

```
budget-tracker-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── goals/
│   │   ├── analytics/
│   │   └── layout.tsx
│   ├── page.tsx (Landing Page)
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── landing/
│   │   ├── Hero3D.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   └── QuickActions.tsx
│   ├── transactions/
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionFilters.tsx
│   ├── budgets/
│   │   ├── BudgetCard.tsx
│   │   ├── BudgetProgress.tsx
│   │   └── BudgetForm.tsx
│   ├── analytics/
│   │   ├── SpendingTrendsChart.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   ├── HealthScoreGauge.tsx
│   │   └── HeatmapCalendar.tsx
│   └── shared/
│       ├── AnimatedCard.tsx
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── budgets.ts
│   │   ├── goals.ts
│   │   └── analytics.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useBudgets.ts
│   │   └── useAnalytics.ts
│   ├── store/
│   │   └── authStore.ts
│   └── utils/
│       ├── currency.ts
│       ├── date.ts
│       └── animations.ts
└── public/
    ├── models/ (3D assets)
    └── images/
```

---

## Page Specifications

### 1. Landing Page (`/`)

**Theme:** Dark mode with vibrant accent colors (purple/blue gradients)

#### Sections:

**Hero Section**
- **3D Background:** Animated floating coins/currency symbols using Three.js
- **Headline:** "Master Your Money with AI-Powered Insights"
- **Subheadline:** "Track expenses, set budgets, achieve goals - all in one beautiful platform"
- **CTA Buttons:** "Get Started Free" + "Watch Demo"
- **GSAP Scroll Animation:** Parallax effect on 3D elements, fade-in text on scroll

**3D Interactive Section**
- **Three.js Scene:** Rotating 3D pie chart showing category breakdown
- **User Interaction:** Mouse move affects rotation/camera angle
- **Scroll Trigger:** Chart assembles piece by piece as user scrolls

**Features Section** (Cards with Framer Motion)
- Real-time expense tracking
- Smart budget alerts
- Multi-currency support
- Goal tracking with milestones
- Advanced analytics & insights
- CSV import/export
- **Animation:** Cards slide in from bottom with stagger effect

**Analytics Preview**
- Live demo of dashboard charts
- Animated number counters
- **GSAP ScrollTrigger:** Charts draw/animate when in viewport

**Testimonials** (Optional)
- Carousel with smooth transitions
- **Framer Motion:** Fade + slide animations

**Pricing** (If applicable)
- Feature comparison table
- **Hover Effects:** Scale + glow on hover

**Footer**
- Links, social media
- Newsletter signup

---

### 2. Authentication Pages

#### Login (`/login`)
- **Design:** Glassmorphism card on gradient background
- **3D Element:** Floating lock icon (Three.js) in background
- **Animation:** Form inputs slide in from right
- **Fields:** Email, Password, "Remember Me"
- **Social Login:** Google, GitHub (optional)

#### Register (`/register`)
- Similar design to login
- **Additional Fields:** Name, Currency preference
- **Animation:** Multi-step form with progress indicator
- **Framer Motion:** Step transitions

---

### 3. Dashboard (`/dashboard`)

**Layout:** Sidebar + Top Header + Main Content

#### Overview Tab
**Key Metrics Cards** (Animated with Framer Motion)
- Total Income (current month)
- Total Expenses (current month)
- Net Savings
- Savings Rate %
- **Animation:** Count-up effect on mount

**Charts Section**
- **Spending Trends:** Line chart (last 6 months)
- **Category Breakdown:** Animated donut chart
- **Budget Performance:** Progress bars with percentage

**Recent Transactions**
- Last 5 transactions
- Quick actions (edit, delete)

**Upcoming Bills**
- Recurring transactions due soon
- Badge indicators for urgency

**Quick Actions**
- Add Transaction (Modal)
- Create Budget
- Set Goal
- **Hover Effect:** Scale + shadow

---

### 4. Transactions (`/transactions`)

**Features:**
- **List View:** Paginated table with sorting
- **Filters:** Date range, category, type
- **Search:** Real-time search
- **Bulk Actions:** Export to CSV
- **Modal Forms:** Add/Edit transaction
- **Animations:**
  - Table rows fade in with stagger
  - Filter panel slides from top
  - Modal: Scale + fade in

**Columns:**
- Date, Description, Category, Amount, Currency, Actions

---

### 5. Budgets (`/budgets`)

**Layout:** Grid of budget cards

**Budget Card Design:**
- Category name + icon
- Progress bar (animated fill)
- Spent / Limit
- Status badge (on-track, warning, over)
- **Color Coding:**
  - Green: <75%
  - Yellow: 75-99%
  - Red: ≥100%

**Add Budget Modal:**
- Category selector
- Amount input
- Date range picker
- **Animation:** Form fields appear sequentially

---

### 6. Goals (`/goals`)

**Layout:** Card grid

**Goal Card:**
- Goal name
- Progress circle (animated SVG)
- Current / Target amount
- Target date
- Milestone indicators (25%, 50%, 75%, 100%)
- **Confetti Animation:** When goal is completed

**Add Goal Modal:**
- Name, Target Amount, Target Date
- **Framer Motion:** Slide up transition

---

### 7. Analytics (`/analytics`)

**Comprehensive Dashboard with Multiple Visualizations**

#### Sections:

**Financial Health Score**
- **Gauge Chart:** Radial progress (0-100)
- Score breakdown by factor
- Recommendations list
- **Animation:** Arc animates from 0 to score

**Spending Trends**
- Multi-line chart (Income vs Expenses)
- Period selector (monthly, weekly, daily)
- **GSAP:** Chart draws on scroll

**Top Categories**
- Horizontal bar chart
- Shows top 5 categories
- **Framer Motion:** Bars extend on mount

**Monthly Summary**
- Comprehensive grid layout
- Income, Expenses, Savings Rate
- Budget status overview
- Goal progress

**Spending Heatmap**
- Calendar heatmap for entire year
- Color intensity = spending amount
- Tooltip on hover

**Year Comparison**
- Side-by-side comparison
- Percentage change indicators
- **Animation:** Comparison bars slide in

**Cash Flow Projection**
- Timeline visualization
- Projected balance over time
- Based on recurring transactions

**Savings Rate Trend**
- Area chart showing savings rate over time
- Trend indicator (improving/declining)

---

## Design System

### Color Palette

**Dark Theme (Primary):**
```css
--background: 0 0% 8%
--foreground: 0 0% 98%
--card: 0 0% 12%
--card-foreground: 0 0% 98%
--primary: 263 70% 60% (Purple)
--primary-foreground: 0 0% 100%
--secondary: 240 5% 20%
--accent: 197 71% 58% (Blue)
--destructive: 0 84% 60% (Red)
--success: 142 71% 45% (Green)
```

**Light Theme (Optional):**
```css
--background: 0 0% 100%
--foreground: 0 0% 8%
--card: 0 0% 98%
--primary: 263 70% 50%
```

### Typography
- **Headings:** Inter / Manrope (Bold)
- **Body:** Inter (Regular, Medium)
- **Mono:** JetBrains Mono (for numbers)

### Spacing Scale
- Consistent 4px base unit
- Use Tailwind's default spacing

---

## Animation Guidelines

### Framer Motion Variants

**Page Transitions:**
```tsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}
```

**Stagger Children:**
```tsx
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
}
```

**Card Hover:**
```tsx
whileHover={{ scale: 1.02, y: -5 }}
transition={{ type: "spring", stiffness: 300 }}
```

### GSAP Scroll Triggers

**Chart Animation:**
```tsx
gsap.from(".chart", {
  scrollTrigger: {
    trigger: ".chart",
    start: "top 80%"
  },
  opacity: 0,
  y: 50,
  duration: 1
})
```

**Parallax:**
```tsx
gsap.to(".float-element", {
  scrollTrigger: {
    scrub: true
  },
  y: -100
})
```

---

## API Integration

### Base Configuration

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints to Implement

**Authentication:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

**Transactions:**
- `GET /transactions` (with filters)
- `POST /transactions`
- `PATCH /transactions/:id`
- `DELETE /transactions/:id`
- `GET /transactions/export` (CSV)
- `POST /transactions/import` (CSV)

**Budgets:**
- `GET /budgets`
- `POST /budgets`
- `GET /budgets/:id`

**Goals:**
- `GET /goals`
- `POST /goals`
- `PATCH /goals/:id/progress`

**Analytics (All 11 endpoints):**
- `GET /analytics/category-breakdown`
- `GET /analytics/spending-trends`
- `GET /analytics/income-vs-expenses`
- `GET /analytics/top-categories`
- `GET /analytics/monthly-summary`
- `GET /analytics/budget-performance`
- `GET /analytics/savings-rate`
- `GET /analytics/cash-flow`
- `GET /analytics/spending-heatmap`
- `GET /analytics/year-comparison`
- `GET /analytics/health-score`

---

## React Query Hooks

```typescript
// lib/hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '@/lib/api/analytics';

export const useSpendingTrends = (period: string, periods: number) => {
  return useQuery({
    queryKey: ['spending-trends', period, periods],
    queryFn: () => analyticsApi.getSpendingTrends({ period, periods }),
  });
};

export const useHealthScore = () => {
  return useQuery({
    queryKey: ['health-score'],
    queryFn: analyticsApi.getHealthScore,
  });
};
```

---

## Performance Optimizations

1. **Code Splitting:** Dynamic imports for heavy components
2. **Image Optimization:** Next.js Image component
3. **Lazy Loading:** React.lazy for 3D components
4. **Memoization:** React.memo for expensive renders
5. **Virtual Scrolling:** For large transaction lists
6. **Debouncing:** Search inputs
7. **Caching:** React Query cache configuration

---

## Accessibility

- **Keyboard Navigation:** Tab order, focus indicators
- **ARIA Labels:** Screen reader support
- **Color Contrast:** WCAG AA compliance
- **Focus Management:** Modal traps, skip links

---

## Responsive Design

**Breakpoints:**
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

**Mobile Considerations:**
- Hamburger menu for sidebar
- Stacked cards on mobile
- Touch-friendly button sizes (min 44px)
- Bottom sheet modals

---

## Development Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Next.js project setup
- [ ] Install dependencies (Framer Motion, Three.js, GSAP, etc.)
- [ ] Configure Tailwind + shadcn/ui
- [ ] Setup API client & auth
- [ ] Landing page with 3D hero

### Phase 2: Authentication (Week 1)
- [ ] Login/Register pages
- [ ] JWT token management
- [ ] Protected routes

### Phase 3: Core Features (Week 2-3)
- [ ] Dashboard overview
- [ ] Transactions CRUD
- [ ] Budgets management
- [ ] Goals tracking
- [ ] Recurring transactions

### Phase 4: Analytics (Week 4)
- [ ] Implement all 11 analytics endpoints
- [ ] Create chart components
- [ ] Health score visualization
- [ ] Heatmap calendar

### Phase 5: Polish (Week 5)
- [ ] Add all animations
- [ ] Responsive optimization
- [ ] Performance tuning
- [ ] Accessibility audit
- [ ] Testing

---

## Installation Commands

```bash
# Create Next.js app
npx create-next-app@latest budget-tracker-frontend --typescript --tailwind --app

# Install core dependencies
npm install framer-motion three @react-three/fiber @react-three/drei gsap lenis

# Install UI & utilities
npm install @tanstack/react-query zustand axios
npm install lucide-react class-variance-authority clsx tailwind-merge

# Install visualization libraries
npm install recharts react-calendar-heatmap

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog dropdown-menu
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## Key Success Metrics

1. **Performance:** Lighthouse score >90
2. **Animations:** Smooth 60fps animations
3. **UX:** Intuitive navigation, <3 clicks to any feature
4. **Visual Impact:** Modern, premium feel
5. **Responsiveness:** Perfect on mobile, tablet, desktop

---

## Additional Features (Nice to Have)

- **Dark/Light Theme Toggle**
- **Multi-language Support** (i18n)
- **PWA Support** (offline mode)
- **Push Notifications** (budget alerts)
- **Export Reports** (PDF)
- **Social Sharing** (goal achievements)
- **Voice Commands** (add transaction via speech)

---

## Resources & Examples

**Inspiration:**
- [Linear](https://linear.app) - Smooth animations
- [Stripe](https://stripe.com) - Clean UI, great charts
- [Vercel](https://vercel.com) - Landing page animations
- [Framer](https://framer.com) - 3D elements

**Libraries Documentation:**
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP](https://greensock.com/docs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

---

## Final Notes

This frontend should feel **premium, fast, and delightful**. Every interaction should be smooth, every transition purposeful. The 3D elements should enhance the experience without overwhelming it. Focus on creating a financial dashboard that users **want** to check daily.

**Make it so beautiful that managing money becomes enjoyable!** 🚀
