import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiAward,
  FiMoreHorizontal,
  FiShoppingBag,
  FiTrendingUp,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiX,
  FiCheck,
  FiRefreshCw,
  FiBarChart3,
  FiPieChart,
  FiActivity
} from "react-icons/fi";
import { GiChiliPepper } from "react-icons/gi";

// Import our API hooks and components
import { useOrderStats } from "../hooks/useOrders";
import { menuApi } from "../api";
import { DashboardCharts } from "./components/DashboardCharts";
import { DashboardCardSkeleton } from "../ui/SkeletonLoader";
import ErrorBoundary from "../components/ErrorBoundary";
import { announceToScreenReader } from "../utils/accessibility";

export default function EnhancedDashboard() {
  const navigate = useNavigate();
  
  // API hooks
  const { stats: orderStats, loading: orderStatsLoading, error: orderStatsError, refetch: refetchOrderStats } = useOrderStats();
  
  // Local state for menu stats
  const [menuStats, setMenuStats] = useState(null);
  const [menuStatsLoading, setMenuStatsLoading] = useState(true);
  const [menuStatsError, setMenuStatsError] = useState(null);
  
  // Dashboard view state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'charts', 'orders', 'menu'
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Fetch menu stats
  useEffect(() => {
    const fetchMenuStats = async () => {
      try {
        setMenuStatsLoading(true);
        setMenuStatsError(null);
        const stats = await menuApi.getMenuStats();
        setMenuStats(stats);
      } catch (error) {
        setMenuStatsError(error.message);
        console.error('Failed to fetch menu stats:', error);
      } finally {
        setMenuStatsLoading(false);
      }
    };
    
    fetchMenuStats();
  }, []);
  
  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetchOrderStats();
      // Refetch menu stats every 30 seconds
      if (Date.now() % 30000 < 5000) {
        const fetchMenuStats = async () => {
          try {
            const stats = await menuApi.getMenuStats();
            setMenuStats(stats);
          } catch (error) {
            console.warn('Auto-refresh menu stats failed:', error);
          }
        };
        fetchMenuStats();
      }
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, refetchOrderStats]);
  
  // Calculate enhanced stats
  const enhancedStats = React.useMemo(() => {
    if (!orderStats || !menuStats) return null;
    
    const todayRevenue = orderStats.last7Days?.[orderStats.last7Days.length - 1]?.revenue || 0;
    const yesterdayRevenue = orderStats.last7Days?.[orderStats.last7Days.length - 2]?.revenue || 0;
    const revenueGrowth = yesterdayRevenue > 0 ? 
      ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : 0;
    
    return {
      totalRevenue: orderStats.totalRevenue || 0,
      revenueGrowth: revenueGrowth,
      totalOrders: orderStats.totalOrders || 0,
      todayOrders: orderStats.todayOrders || 0,
      averageOrderValue: orderStats.averageOrderValue || 0,
      menuItems: menuStats.totalItems || 0,
      availableItems: menuStats.availableItems || 0,
      categories: menuStats.totalCategories || 0,
      spicyItems: menuStats.spicyItemsCount || 0,
      averagePrice: menuStats.averagePrice || 0
    };
  }, [orderStats, menuStats]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    announceToScreenReader(`Switched to ${tab} view`);
  };
  
  const handleRefresh = async () => {
    announceToScreenReader('Refreshing dashboard data');
    refetchOrderStats();
    
    try {
      setMenuStatsLoading(true);
      const stats = await menuApi.getMenuStats();
      setMenuStats(stats);
    } catch (error) {
      setMenuStatsError(error.message);
    } finally {
      setMenuStatsLoading(false);
    }
  };
  
  // Loading state
  const isLoading = orderStatsLoading || menuStatsLoading;
  
  // Error state
  const hasError = orderStatsError || menuStatsError;
  
  if (hasError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h3>
          <p className="text-red-600 mb-4">{orderStatsError || menuStatsError}</p>
          <button 
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiActivity className="text-green-600" />
              Enhanced Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Real-time analytics, comprehensive reporting, and data visualization
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
                aria-label="Auto-refresh dashboard"
              />
              <span>Auto-refresh</span>
            </label>
            
            {/* Manual refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh dashboard data"
            >
              <FiRefreshCw className={`text-sm ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {/* Navigation to other admin sections */}
            <button
              onClick={() => navigate('/admin/menu')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="text-sm" />
              Manage Menu
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Dashboard sections">
            {[
              { id: 'overview', label: 'Overview', icon: FiTrendingUp },
              { id: 'charts', label: 'Analytics', icon: FiBarChart3 },
              { id: 'reports', label: 'Reports', icon: FiPieChart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <tab.icon className="text-sm" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <DashboardCardSkeleton key={index} />
                  ))}
                </div>
              ) : enhancedStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Revenue Card */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ETB {enhancedStats.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">
                          +{enhancedStats.revenueGrowth}% from yesterday
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FiTrendingUp className="text-xl text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Orders Card */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {enhancedStats.totalOrders.toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600">
                          {enhancedStats.todayOrders} today
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiShoppingBag className="text-xl text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Average Order Value */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Order Value
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ETB {enhancedStats.averageOrderValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-600">
                          Per completed order
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiAward className="text-xl text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Menu Items
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {enhancedStats.menuItems}
                        </p>
                        <p className="text-xs text-orange-600">
                          {enhancedStats.availableItems} available
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <FiMoreHorizontal className="text-xl text-orange-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categories
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {enhancedStats.categories}
                        </p>
                        <p className="text-xs text-indigo-600">
                          Menu categories
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FiPieChart className="text-xl text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Spicy Items */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Spicy Items
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {enhancedStats.spicyItems}
                        </p>
                        <p className="text-xs text-red-600">
                          Spicy dishes
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <GiChiliPepper className="text-xl text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Average Price */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Menu Price
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ETB {enhancedStats.averagePrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-teal-600">
                          Average dish price
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <FiBarChart3 className="text-xl text-teal-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Indicator */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          Healthy
                        </p>
                        <p className="text-xs text-green-600">
                          System operating normally
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FiActivity className="text-xl text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'charts' && (
            <DashboardCharts 
              orderStats={orderStats} 
              menuStats={menuStats} 
              loading={isLoading}
            />
          )}
          
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detailed Reports
                </h3>
                <p className="text-gray-600 mb-4">
                  Generate comprehensive reports for business analysis and decision making.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <FiBarChart3 className="text-2xl text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Sales Report</h4>
                    <p className="text-sm text-gray-500">Revenue and order analytics</p>
                  </button>
                  
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <FiPieChart className="text-2xl text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Menu Report</h4>
                    <p className="text-sm text-gray-500">Item performance analysis</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}