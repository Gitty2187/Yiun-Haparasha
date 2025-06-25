import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { apiService } from './services/api';
import { Login } from './components/LoginPage/Login';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Sheets } from './components/Sheets/Sheets';
import { SubscribersTable } from './components/Subscribers/SubscribersTable';

function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [appState, setAppState] = useState({ type: 'dashboard' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState();

  const handleLogin = async (username, password) => {
    try {
      setLoginLoading(true);
      setLoginError(undefined);
      const { user: userData, token } = await apiService.login(username, password);
      await login(userData, token);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'שגיאה בכניסה');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    logout();
    setAppState({ type: 'dashboard' });
  };

  const handleNavigate = (module) => {
    if (module === 'sheets') {
      setAppState({ type: 'sheets' });
    } else if (module === 'dashboard') {
      setAppState({ type: 'dashboard' });
    } else {
      setAppState({ type: 'module', module });
    }
  };

  const handleNavigateToSubscribers = (sheetId, sheetName) => {
    setAppState({ type: 'subscribers', sheetId, sheetName });
  };

  const getCurrentModule = () => {
    switch (appState.type) {
      case 'dashboard':
        return 'dashboard';
      case 'sheets':
        return 'sheets';
      case 'subscribers':
        return 'sheets'; // Still part of sheets module
      case 'module':
        return appState.module;
      default:
        return 'dashboard';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Login 
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  const renderContent = () => {
    switch (appState.type) {
      case 'dashboard':
        return <Dashboard user={user} />;
      
      case 'sheets':
        return (
          <Sheets 
            onNavigateToSubscribers={handleNavigateToSubscribers}
            onBack={() => setAppState({ type: 'dashboard' })}
          />
        );
      
      case 'subscribers':
        return (
          <SubscribersTable
            sheetId={appState.sheetId}
            sheetName={appState.sheetName}
          />
        );
      
      case 'module':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {appState.module === 'subscribers' && 'מנויים'}
              {appState.module === 'payslips' && 'תלושים'}
              {appState.module === 'scholarships' && 'מלגות'}
              {appState.module === 'projects' && 'פרויקטים'}
              {appState.module === 'reports' && 'דוחות'}
            </h2>
            <p className="text-gray-600 mb-6">המודול הזה בפיתוח</p>
            <button
              onClick={() => setAppState({ type: 'dashboard' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              חזרה לדשבורד
            </button>
          </div>
        );
      
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentModule={getCurrentModule()}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;