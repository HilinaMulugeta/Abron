import React, { useMemo } from 'react';
import { SimpleBarChart, SimpleLineChart, SimplePieChart, SimpleDonutChart } from '../../ui/SimpleChart';
import { ChartSkeleton } from '../../ui/SkeletonLoader';

// Revenue Chart Component
export const RevenueChart = ({ orderStats, loading }) => {
  const revenueData = useMemo(() => {
    if (!orderStats?.last7Days) return [];
    
    return orderStats.last7Days.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      revenue: day.revenue
    }));
  }, [orderStats]);
  
  if (loading) {
    return <ChartSkeleton height="350px" />;
  }
  
  return (
    <SimpleLineChart
      data={revenueData}
      xKey="date"
      yKey="revenue"
      title="Revenue Trend (Last 7 Days)"
      height={350}
      lineColor="#2f5d4a"
    />
  );
};

// Orders Chart Component
export const OrdersChart = ({ orderStats, loading }) => {
  const ordersData = useMemo(() => {
    if (!orderStats?.last7Days) return [];
    
    return orderStats.last7Days.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { 
        weekday: 'short' 
      }),
      orders: day.orders
    }));
  }, [orderStats]);
  
  if (loading) {
    return <ChartSkeleton height="300px" />;
  }
  
  return (
    <SimpleBarChart
      data={ordersData}
      xKey="date"
      yKey="orders"
      title="Daily Orders (Last 7 Days)"
      height={300}
      color="#e0a632"
    />
  );
};

// Order Status Distribution Chart
export const OrderStatusChart = ({ orderStats, loading }) => {
  const statusData = useMemo(() => {
    if (!orderStats?.statusCounts) return [];
    
    const statusLabels = {
      pending: 'Pending',
      confirmed: 'Confirmed', 
      preparing: 'Preparing',
      'on the way': 'On the Way',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    
    return Object.entries(orderStats.statusCounts).map(([status, count]) => ({
      label: statusLabels[status.toLowerCase()] || status,
      value: count,
      status: status.toLowerCase()
    }));
  }, [orderStats]);
  
  const colors = ['#2f5d4a', '#e0a632', '#d56a2b', '#f4c867', '#1e4033', '#d15d46'];
  
  if (loading) {
    return <ChartSkeleton height="300px" />;
  }
  
  return (
    <SimplePieChart
      data={statusData}
      labelKey="label"
      valueKey="value"
      title="Order Status Distribution"
      colors={colors}
    />
  );
};

// Menu Categories Chart
export const MenuCategoriesChart = ({ menuStats, loading }) => {
  const categoryData = useMemo(() => {
    if (!menuStats?.categoryStats) return [];
    
    return menuStats.categoryStats.map(cat => ({
      category: cat.category,
      count: cat.count,
      available: cat.available
    }));
  }, [menuStats]);
  
  if (loading) {
    return <ChartSkeleton height="300px" />;
  }
  
  return (
    <SimpleBarChart
      data={categoryData}
      xKey="category"
      yKey="count"
      title="Menu Items by Category"
      height={300}
      color="#d56a2b"
    />
  );
};

// Price Distribution Chart
export const PriceDistributionChart = ({ menuStats, loading }) => {
  const priceData = useMemo(() => {
    if (!menuStats?.priceDistribution) return [];
    
    return menuStats.priceDistribution.map(range => ({
      range: `ETB ${range.range}`,
      count: range.count
    }));
  }, [menuStats]);
  
  if (loading) {
    return <ChartSkeleton height="300px" />;
  }
  
  return (
    <SimpleBarChart
      data={priceData}
      xKey="range"
      yKey="count"
      title="Price Distribution"
      height={300}
      color="#2f5d4a"
    />
  );
};

// Menu Availability Donut Chart
export const MenuAvailabilityChart = ({ menuStats, loading }) => {
  const availabilityData = useMemo(() => {
    if (!menuStats) return [];
    
    return [
      {
        label: 'Available',
        value: menuStats.availableItems || 0
      },
      {
        label: 'Unavailable', 
        value: menuStats.unavailableItems || 0
      }
    ];
  }, [menuStats]);
  
  const centerText = useMemo(() => {
    if (!menuStats) return null;
    
    return {
      value: menuStats.totalItems || 0,
      label: 'Total Items'
    };
  }, [menuStats]);
  
  if (loading) {
    return <ChartSkeleton height="300px" />;
  }
  
  return (
    <SimpleDonutChart
      data={availabilityData}
      labelKey="label"
      valueKey="value"
      title="Menu Availability"
      colors={['#2f5d4a', '#d15d46']}
      centerText={centerText}
    />
  );
};

// Combined Dashboard Charts Component
export const DashboardCharts = ({ 
  orderStats, 
  menuStats, 
  loading = false 
}) => {
  return (
    <div className="space-y-6">
      {/* Revenue and Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart orderStats={orderStats} loading={loading} />
        <OrdersChart orderStats={orderStats} loading={loading} />
      </div>
      
      {/* Status and Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart orderStats={orderStats} loading={loading} />
        <MenuCategoriesChart menuStats={menuStats} loading={loading} />
      </div>
      
      {/* Price Distribution and Availability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceDistributionChart menuStats={menuStats} loading={loading} />
        <MenuAvailabilityChart menuStats={menuStats} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardCharts;