import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
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

const LoadingScreen = ({ seeding }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0e1a', gap:20 }}>
    <div style={{ width:56, height:56, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>₹</div>
    <div style={{ color:'#e8edf5', fontSize:20, fontWeight:700 }}>IT Financial Insights</div>
    <div className="spinner" />
    <div style={{ color:'#8a9bb5', fontSize:13 }}>
      {seeding ? '⚡ First launch — seeding Firestore database...' : '🔗 Connecting to Firestore...'}
    </div>
    {seeding && <div style={{ color:'#4a5a73', fontSize:12 }}>Loading 84 records across 7 companies × 12 quarters</div>}
  </div>
);

const AppContent = () => {
  const { darkMode } = useTheme();
  const { loading, seeding, error } = useData();
  const [activePage, setActivePage] = useState('executive');
  const [selectedCompany, setSelectedCompany] = useState('TCS');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4FY25');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading || seeding) return <LoadingScreen seeding={seeding} />;
  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0e1a', color:'#ef4444', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:32 }}>⚠️</div>
      <div style={{ fontWeight:700 }}>Firestore connection failed</div>
      <div style={{ fontSize:13, color:'#8a9bb5', maxWidth:400, textAlign:'center' }}>{error}</div>
      <div style={{ fontSize:12, color:'#4a5a73' }}>Check Firestore rules: allow read, write if true;</div>
    </div>
  );

  const pages = {
    executive:     <ExecutiveSummary company={selectedCompany} quarter={selectedQuarter} />,
    revenue:       <RevenueAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    profitability: <ProfitabilityAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    employees:     <EmployeeAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    verticals:     <VerticalAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    geography:     <GeographyAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    clients:       <ClientAnalysis company={selectedCompany} quarter={selectedQuarter} />,
    comparison:    <CompanyComparison quarter={selectedQuarter} />,
    ai:            <AIInsights company={selectedCompany} quarter={selectedQuarter} />,
    upload:        <DataUpload />,
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header
          selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany}
          selectedQuarter={selectedQuarter}  setSelectedQuarter={setSelectedQuarter}
          sidebarOpen={sidebarOpen}          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
        />
        <div className="page-content">{pages[activePage]}</div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}
