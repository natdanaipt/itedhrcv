import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import OrgChartPage from './pages/OrgChartPage';
import CVGeneratorPage from './pages/CVGeneratorPage';
import DashboardPage from './pages/DashboardPage';
import AIParserPage from './pages/AIParserPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('org-chart');

  const renderPage = () => {
    switch (currentTab) {
      case 'org-chart':
        return <OrgChartPage />;
      case 'cv-generator':
        return <CVGeneratorPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-parser':
        return <AIParserPage />;
      default:
        return <OrgChartPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header currentTab={currentTab} />
        <main className="p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
