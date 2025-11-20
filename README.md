<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FinDash - Market Leverage Analyzer

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

> A professional financial dashboard analyzing market leverage, risk ratios, and interest costs using comprehensive market data from 2010-2025.

## 🎯 Overview

**FinDash** is a sophisticated financial analysis dashboard that provides real-time insights into market leverage dynamics, risk assessment, and financial metrics. Built with modern web technologies, it offers interactive visualizations and customizable parameters for financial professionals.

### Key Features

- 📊 **Market Leverage Analysis** - Track and analyze market leverage ratios over time
- 📈 **Multi-dimensional Charts** - 7 different visualization types for comprehensive analysis
- ⚠️ **Risk Assessment** - Customizable risk thresholds with visual indicators
- 💹 **Real-time KPI Metrics** - Key performance indicators at a glance
- 🎛️ **Interactive Controls** - Adjust parameters and filter data in real-time
- 📱 **Responsive Design** - Optimized for desktop and mobile devices

## 🏗️ Tech Stack

### Core Technologies
- **React 19.2.0** - Modern UI framework with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite 6.2.0** - Lightning-fast build tool and dev server

### UI & Visualization
- **TailwindCSS** - Utility-first CSS framework (CDN)
- **Recharts 3.4.1** - Composable charting library for React
- **Lucide React** - Beautiful & consistent icon library

## 📁 Project Structure

```
levGemini3/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard component
│   │   ├── Sidebar.tsx            # Control panel sidebar
│   │   ├── KPICard.tsx            # KPI metric cards
│   │   └── charts/
│   │       └── ChartContainer.tsx # Reusable chart wrapper
│   ├── services/
│   │   └── dataService.ts         # Data generation & calculations
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Root application component
│   └── index.tsx                  # Application entry point
├── public/
│   ├── index.html                 # HTML template
│   └── index.css                  # Global styles
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── .env.local                     # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Edit .env.local and add your Gemini API key
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📊 Core Features

### 1. Market Leverage Analysis
Track market leverage ratios with customizable risk thresholds:
- **Green Zone** (Low Risk): < 3.5%
- **Yellow Zone** (Warning): 3.5% - 4.5%
- **Red Zone** (Danger): > 4.5%

### 2. Key Performance Indicators

#### Strategy Metrics
- Market Leverage Ratio (Annualized Average)
- Money Supply Ratio (Margin Debt / M2)
- Annual Interest Cost (Last 12 Months Total)
- Vulnerability Index (1Y Mean Risk Score)

#### Benchmark Comparison
- S&P 500 Annual Return (YoY)
- VIX Average (Annual Mean Volatility)
- Fed Funds Rate (Period Average)

### 3. Visualization Types

1. **Market Leverage Ratio Analysis**
   - Time-series chart with risk zone backgrounds
   - Reference areas for critical thresholds

2. **Money Supply Ratio**
   - Area chart showing Margin Debt to M2 relationship

3. **Interest Cost Analysis**
   - Composed chart (Bar + Line) for cost and rate comparison

4. **Leverage Change Rate**
   - Dual-line chart comparing MoM vs YoY changes

5. **Investor Net Worth Growth**
   - Step chart showing cumulative net worth development

6. **Vulnerability Index**
   - Multi-layer risk background with color-coded zones

7. **VIX vs Leverage Correlation**
   - Scatter plot with regression trend line

### 4. Interactive Controls

- **Date Range Filter**: Select data range (2010-2025)
- **Moving Average Window**: Adjust smoothing (1-24 months)
- **Risk Thresholds**: Customize warning and danger levels

## 📈 Data Model

### MarketDataPoint Structure
```typescript
interface MarketDataPoint {
  date: string;
  timestamp: number;
  finra_D: number;              // Margin Debt (Billions)
  vix_index: number;            // Volatility Index
  sp500_index: number;          // S&P 500 Index
  m2_money_supply: number;      // M2 Money Supply (Billions)
  federal_funds_rate: number;   // Federal Funds Rate (%)

  // Derived Metrics
  market_cap: number;
  market_leverage_ratio: number;
  money_supply_ratio: number;
  annual_interest_cost: number;
  leverage_change_mom: number;
  leverage_change_yoy: number;
  investor_net_worth: number;
  vulnerability_index: number;
}
```

### Key Calculations

1. **Market Leverage Ratio**
   ```
   Leverage Ratio = Margin Debt / Market Capitalization
   ```

2. **Money Supply Ratio**
   ```
   Money Supply Ratio = Margin Debt / M2 Money Supply
   ```

3. **Annual Interest Cost**
   ```
   Interest Cost = Margin Debt × (Fed Rate / 100)
   ```

4. **Vulnerability Index**
   ```
   Vulnerability = (Leverage Ratio × 100) × (VIX / 10)
   ```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0A2540` - Main brand color
- **Light Blue**: `#F0F4F8` - Background accents
- **Gray**: `#F7F9FC` - Background surface
- **Text**: `#334155` - Primary text color
- **Danger**: `#EF4444` - High-risk indicators
- **Warning**: `#F59E0B` - Caution indicators
- **Success**: `#10B981` - Positive trends

### Design Principles
- Clean, professional interface
- Consistent spacing and typography
- Accessible color contrasts
- Intuitive navigation
- Responsive layout for all devices

## 📊 Data Sources

### External APIs
- **FINRA** - Margin Debt data
- **FRED** - M2 Money Supply, Federal Funds Rate
- **Yahoo Finance** - S&P 500 Index, VIX Index

> **Note**: This application currently runs on generated mock data that closely mirrors historical market trends for demonstration purposes.

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vite Configuration
Located in `vite.config.ts`:
- Dev server on port 3000
- Environment variable injection
- Path alias configuration (`@` → root directory)

## 🧪 Development

### TypeScript Configuration
- Strict mode enabled
- JSX support for React
- Path mapping configured

### Build Optimization
- Code splitting
- Tree shaking
- Asset optimization
- Fast refresh for development

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Charts powered by Recharts
- Icons by Lucide React
- Styled with TailwindCSS

---

<div align="center">
<p><strong>FinDash</strong> - Professional Financial Market Analysis</p>
<p>View AI Studio App: <a href="https://ai.studio/apps/drive/1Q6v-yNujcgWo-HI7phaIFzJwTNVp0zzf">AI Studio</a></p>
</div>
