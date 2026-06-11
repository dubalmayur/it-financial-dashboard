import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExecutiveSummary from './pages/ExecutiveSummary';
import RevenueAnalysis from './pages/RevenueAnalysis';
import ProfitabilityAnalysis from './pages/ProfitabilityAnalysis';
import EmployeeAnalysis from './pages/EmployeeAnalysis';
import VerticalAnalysis from './pages/VerticalAnalysis';
import GeographyAnalysis from './pages/GeographyAnalysis';
import ClientAnalysis from './pages/ClientAnalysis';
import CompanyComparison from './pages/CompanyComparison';
import AIInsights from './pages/AIInsights';
import DataUpload from './pages/DataUpload';
import './App.css';

const AppContent = () => {
  const { darkMode } = useTheme();
  const [activePage, setActivePage] = useState('executive');
  const [selectedCompany, setSelectedCompany] = useState('TCS');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4FY25');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pages = {
    executive: <ExecutiveSummary company={selectedCompany} quarter={selectedQuarter} />,
    revenue: <RevenueAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    profitability: <ProfitabilityAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    employees: <EmployeeAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    verticals: <VerticalAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    geography: <GeographyAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    clients: <ClientAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    comparison: <CompanyComparison quarter={selectedQuarter} />,
    ai: <AIInsights company={selectedCompany} quarter={selectedQuarter} />,
    upload: <DataUpload />,
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header
          selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany}
          selectedQuarter={selectedQuarter} setSelectedQuarter={setSelectedQuarter}
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          activePage={activePage}
        />
        <div className="page-content">
          {pages[activePage]}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <ThemeProvider><AppContent /></ThemeProvider>;
}
