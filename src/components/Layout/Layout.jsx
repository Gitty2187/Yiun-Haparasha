import React, { useState } from 'react';
import { 
  LogOut, 
  User as UserIcon, 
  Settings,
  Users, 
  FileText, 
  Receipt, 
  GraduationCap, 
  FolderOpen, 
  BarChart3,
  Home,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const modules = [
  { id: 'dashboard', name: 'דשבורד', icon: Home },
  { id: 'subscribers', name: 'מנויים', icon: Users },
  { id: 'sheets', name: 'גליונות', icon: FileText },
  { id: 'payslips', name: 'תלושים', icon: Receipt },
  { id: 'scholarships', name: 'מלגות', icon: GraduationCap },
  { id: 'projects', name: 'פרויקטים', icon: FolderOpen },
  { id: 'reports', name: 'דוחות', icon: BarChart3 }
];

export const Layout = ({ 
  user, 
  children, 
  onLogout, 
  onNavigate, 
  currentModule = 'dashboard' 
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-l border-gray-200 shadow-sm flex flex-col flex-shrink-0 transition-all duration-300`}>
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold text-gray-900">עיון הפרשה</h1>
              <p className="text-sm text-gray-500 mt-1">מערכת ניהול</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = currentModule === module.id;
              
              return (
                <li key={module.id}>
                  <button
                    onClick={() => onNavigate(module.id)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'space-x-3 rtl:space-x-reverse px-4'} py-3 rounded-lg text-right transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={sidebarCollapsed ? module.name : ''}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                    {!sidebarCollapsed && (
                      <span className="font-medium">{module.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Menu - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'justify-between px-4'} py-3 text-right bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors`}
              title={sidebarCollapsed ? user.name : ''}
            >
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {userMenuOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              )}
              <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3 rtl:space-x-reverse'}`}>
                {!sidebarCollapsed && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.username}</p>
                  </div>
                )}
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </button>

            {userMenuOpen && !sidebarCollapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    // Handle profile edit
                  }}
                  className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">עריכת פרטים</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-right hover:bg-gray-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">יציאה</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 text-right">
              {modules.find(m => m.id === currentModule)?.name || 'דשבורד'}
            </h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};