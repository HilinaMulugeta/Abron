import React from 'react';

// Base Skeleton component
export const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  width = '100%', 
  height = '1rem',
  animate = true,
  ...props 
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animate ? 'animate-pulse' : '';
  
  const variantClasses = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded-sm'
  };
  
  const style = {
    width: typeof width === 'string' ? width : `${width}px`,
    height: typeof height === 'string' ? height : `${height}px`
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
      aria-label="Loading content..."
      role="status"
      {...props}
    />
  );
};

// Menu Item Skeleton
export const MenuItemSkeleton = ({ showImage = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" role="status" aria-label="Loading menu item...">
      {showImage && (
        <Skeleton 
          className="w-full" 
          height="200px"
          variant="rectangular" 
        />
      )}
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton width="75%" height="1.5rem" />
          <Skeleton width="100%" height="3rem" />
          <div className="flex justify-between items-center">
            <Skeleton width="30%" height="1.25rem" />
            <Skeleton width="25%" height="2rem" variant="rectangular" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Menu Grid Skeleton
export const MenuGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemSkeleton key={index} />
      ))}
    </div>
  );
};

// Order Item Skeleton
export const OrderItemSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200" role="status" aria-label="Loading order...">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <Skeleton width="120px" height="1.25rem" />
          <Skeleton width="80px" height="1rem" />
        </div>
        <Skeleton width="60px" height="1.5rem" variant="rectangular" />
      </div>
      
      <div className="space-y-2 mb-4">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="80%" height="1rem" />
      </div>
      
      <div className="flex justify-between items-center">
        <Skeleton width="100px" height="1rem" />
        <Skeleton width="80px" height="1.25rem" />
      </div>
    </div>
  );
};

// Dashboard Card Skeleton
export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6" role="status" aria-label="Loading dashboard data...">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width="80px" height="1rem" />
          <Skeleton width="60px" height="2rem" />
        </div>
        <Skeleton variant="circular" width="3rem" height="3rem" />
      </div>
    </div>
  );
};

// Chart Skeleton
export const ChartSkeleton = ({ height = "300px" }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6" role="status" aria-label="Loading chart...">
      <div className="space-y-4">
        <Skeleton width="150px" height="1.5rem" />
        <div className="relative" style={{ height }}>
          <Skeleton width="100%" height="100%" variant="rectangular" />
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton 
                key={index}
                width="20px" 
                height={`${Math.random() * 60 + 40}%`}
                variant="rectangular"
                className="bg-gray-300"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" role="status" aria-label="Loading table...">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} width="80%" height="1rem" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} width="90%" height="1rem" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6" role="status" aria-label="Loading profile...">
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton variant="circular" width="4rem" height="4rem" />
        <div className="space-y-2">
          <Skeleton width="150px" height="1.5rem" />
          <Skeleton width="200px" height="1rem" />
        </div>
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton width="100px" height="1rem" />
            <Skeleton width="100%" height="2.5rem" variant="rectangular" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Results Skeleton
export const SearchResultsSkeleton = ({ count = 8 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow border">
          <Skeleton variant="rectangular" width="80px" height="80px" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="1.25rem" />
            <Skeleton width="100%" height="1rem" />
            <div className="flex justify-between items-center">
              <Skeleton width="40%" height="1rem" />
              <Skeleton width="80px" height="1.5rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Generic Page Skeleton
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton width="200px" height="2rem" className="mb-4" />
          <Skeleton width="100%" height="1rem" />
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MenuGridSkeleton count={6} />
          </div>
          <div className="space-y-6">
            <DashboardCardSkeleton />
            <ChartSkeleton height="200px" />
          </div>
        </div>
      </div>
    </div>
  );
};