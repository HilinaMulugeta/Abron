import React, { useMemo } from 'react';

// Simple Bar Chart Component
export const SimpleBarChart = ({ 
  data = [], 
  xKey = 'name', 
  yKey = 'value',
  title,
  height = 300,
  color = '#3B82F6',
  backgroundColor = '#F3F4F6'
}) => {
  // Safety check for data
  const safeData = Array.isArray(data) ? data : [];
  
  const maxValue = useMemo(() => {
    if (safeData.length === 0) return 1;
    return Math.max(...safeData.map(item => Number(item?.[yKey]) || 0));
  }, [safeData, yKey]);
  
  const chartHeight = Math.max(height - 60, 100); // Account for labels and padding
  
  if (safeData.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        <div 
          className="flex items-center justify-center text-gray-400 text-sm"
          style={{ height: `${height}px` }}
        >
          No data available
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Chart area */}
        <div 
          className="flex items-end justify-between px-2" 
          style={{ height: `${chartHeight}px` }}
        >
          {safeData.map((item, index) => {
            if (!item) return null;
            
            const value = Number(item[yKey]) || 0;
            const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
            const xValue = item[xKey] || `Item ${index + 1}`;
            
            return (
              <div key={`bar-${index}-${xValue}`} className="flex flex-col items-center flex-1 mx-1">
                {/* Value label */}
                <div className="text-xs font-semibold text-gray-600 mb-2">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                
                {/* Bar */}
                <div
                  className="w-full min-w-8 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${Math.max(barHeight, 2)}px`,
                    backgroundColor: color,
                    minHeight: '4px'
                  }}
                  title={`${xValue}: ${value}`}
                />
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between px-2 mt-2">
          {safeData.map((item, index) => {
            const xValue = item?.[xKey] || `Item ${index + 1}`;
            return (
              <div key={`label-${index}-${xValue}`} className="text-xs text-gray-500 text-center flex-1 mx-1">
                {xValue}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Simple Line Chart Component
export const SimpleLineChart = ({ 
  data = [], 
  xKey = 'date', 
  yKey = 'value',
  title,
  height = 300,
  lineColor = '#10B981',
  backgroundColor = '#F3F4F6'
}) => {
  // Safety check for data
  const safeData = Array.isArray(data) ? data.filter(item => item != null) : [];
  
  const { maxValue, minValue } = useMemo(() => {
    if (safeData.length === 0) return { maxValue: 1, minValue: 0 };
    
    const values = safeData.map(item => Number(item?.[yKey]) || 0);
    return {
      maxValue: Math.max(...values),
      minValue: Math.min(...values)
    };
  }, [safeData, yKey]);
  
  const chartHeight = height - 60;
  const chartWidth = 400; // Fixed width for simplicity
  
  const getCoordinates = (index, value) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const normalizedValue = maxValue > minValue ? (value - minValue) / (maxValue - minValue) : 0.5;
    const y = chartHeight - (normalizedValue * chartHeight);
    return { x, y };
  };
  
  const pathData = useMemo(() => {
    if (data.length === 0) return '';
    
    let path = '';
    data.forEach((item, index) => {
      const { x, y } = getCoordinates(index, item[yKey] || 0);
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  }, [data, yKey, chartHeight, chartWidth]);
  
  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="relative overflow-hidden">
        <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height={chartHeight} fill="url(#grid)" />
          
          {/* Line */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={lineColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Data points */}
          {data.map((item, index) => {
            const { x, y } = getCoordinates(index, item[yKey] || 0);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={lineColor}
                className="hover:r-6 cursor-pointer transition-all"
              >
                <title>{`${item[xKey]}: ${item[yKey]}`}</title>
              </circle>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((item, index) => {
            const { x } = getCoordinates(index, item[yKey] || 0);
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {item[xKey]}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Simple Pie Chart Component
export const SimplePieChart = ({ 
  data = [], 
  labelKey = 'label', 
  valueKey = 'value',
  title,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
}) => {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
  }, [data, valueKey]);
  
  const chartData = useMemo(() => {
    let currentAngle = 0;
    
    return data.map((item, index) => {
      const value = item[valueKey] || 0;
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const angle = total > 0 ? (value / total) * 360 : 0;
      
      const slice = {
        ...item,
        percentage,
        angle,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: colors[index % colors.length]
      };
      
      currentAngle += angle;
      return slice;
    });
  }, [data, valueKey, total, colors]);
  
  const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const start = {
      x: centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    
    const end = {
      x: centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  };
  
  const centerX = 120;
  const centerY = 120;
  const radius = 100;
  
  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="flex items-center justify-center space-x-8">
        {/* Pie Chart */}
        <svg width="240" height="240">
          {chartData.map((item, index) => (
            <path
              key={index}
              d={createPath(centerX, centerY, radius, item.startAngle, item.endAngle)}
              fill={item.color}
              stroke="#fff"
              strokeWidth="2"
              className="hover:opacity-80 cursor-pointer transition-opacity"
            >
              <title>{`${item[labelKey]}: ${item[valueKey]} (${item.percentage.toFixed(1)}%)`}</title>
            </path>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item[labelKey]} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Donut Chart (variation of pie chart)
export const SimpleDonutChart = ({ 
  data = [], 
  labelKey = 'label', 
  valueKey = 'value',
  title,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  centerText
}) => {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
  }, [data, valueKey]);
  
  const chartData = useMemo(() => {
    let currentAngle = 0;
    
    return data.map((item, index) => {
      const value = item[valueKey] || 0;
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const angle = total > 0 ? (value / total) * 360 : 0;
      
      const slice = {
        ...item,
        percentage,
        angle,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: colors[index % colors.length]
      };
      
      currentAngle += angle;
      return slice;
    });
  }, [data, valueKey, total, colors]);
  
  const createDonutPath = (centerX, centerY, outerRadius, innerRadius, startAngle, endAngle) => {
    const startOuter = {
      x: centerX + outerRadius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: centerY + outerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    
    const endOuter = {
      x: centerX + outerRadius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: centerY + outerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    
    const startInner = {
      x: centerX + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: centerY + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    
    const endInner = {
      x: centerX + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: centerY + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}
      Z
    `;
  };
  
  const centerX = 120;
  const centerY = 120;
  const outerRadius = 100;
  const innerRadius = 60;
  
  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="flex items-center justify-center space-x-8">
        {/* Donut Chart */}
        <div className="relative">
          <svg width="240" height="240">
            {chartData.map((item, index) => (
              <path
                key={index}
                d={createDonutPath(centerX, centerY, outerRadius, innerRadius, item.startAngle, item.endAngle)}
                fill={item.color}
                stroke="#fff"
                strokeWidth="2"
                className="hover:opacity-80 cursor-pointer transition-opacity"
              >
                <title>{`${item[labelKey]}: ${item[valueKey]} (${item.percentage.toFixed(1)}%)`}</title>
              </path>
            ))}
          </svg>
          
          {/* Center text */}
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{centerText.value}</div>
                <div className="text-sm text-gray-500">{centerText.label}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item[labelKey]} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};