import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import SearchDiscoveryView from './views/SearchDiscoveryView';
import BookingsView from './views/BookingsView';
import HelperDashboardView from './views/HelperDashboardView';
import AdminDashboardView from './views/AdminDashboardView';

function AppContent() {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'search':
        return <SearchDiscoveryView />;
      case 'bookings':
        return <BookingsView />;
      case 'helper-dashboard':
        return <HelperDashboardView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <SearchDiscoveryView />;
    }
  };

  return (
    <Layout>
      {renderActiveView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
