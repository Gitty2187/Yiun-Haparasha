import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';

export const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sheet_created':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'subscriber_added':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'subscriber_updated':
        return <Activity className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'sheet_created':
        return 'bg-green-50 border-green-200';
      case 'subscriber_added':
        return 'bg-blue-50 border-blue-200';
      case 'subscriber_updated':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">סה"כ גליונות</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSheets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">סה"כ מנויים</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">גליונות פעילים</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSheets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">צמיחה חודשית</p>
                <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">פעילות אחרונה</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      {activity.sheetName && (
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.sheetName}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">פעולות מהירות</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
              <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <span className="text-blue-700 font-medium">צור גיליון חדש</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
              <Users className="w-5 h-5 text-green-600 group-hover:text-green-700" />
              <span className="text-green-700 font-medium">הוסף מנוי חדש</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
              <BarChart3 className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
              <span className="text-purple-700 font-medium">צפה בדוחות</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};