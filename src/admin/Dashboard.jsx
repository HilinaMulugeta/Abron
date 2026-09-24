import React, { useState, useContext, useMemo } from "react";
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
} from "react-icons/fi";
import { GiChiliPepper } from "react-icons/gi";
import { ShopContext } from "../components/ShopContext";
import { useTheme } from "../theme/ThemeContext";
import DashboardCharts from "./components/DashboardCharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const managerName = (() => { try { return JSON.parse(localStorage.getItem("admin_profile") || "{}").name?.split(/[ (]/)[0] || "Admin"; } catch { return "Admin"; } })();
  const {
    products,
    orders,
    adminStats,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    updateOrderStatus,
  } = useContext(ShopContext);

  // Modal States
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters & Search
  const [dishSearch, setDishSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");

  // Form State for Dish Modal
  const [dishFormData, setDishFormData] = useState({
    name: "",
    category: "Traditional Stew",
    price: "",
    image: "/images/Doro.jpg",
    spicy: false,
    status: "Available",
    description: "",
  });

  // Open modal for Adding
  const handleOpenAddDish = () => {
    setEditingDish(null);
    setDishFormData({
      name: "",
      category: "Traditional Stew",
      price: "",
      image: "/images/Doro.jpg",
      spicy: false,
      status: "Available",
      description: "",
    });
    setDishModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditDish = (dish) => {
    setEditingDish(dish);
    setDishFormData({
      name: dish.name || "",
      category: dish.category || "Traditional Stew",
      price: dish.price || "",
      image: dish.image || "/images/Doro.jpg",
      spicy: Boolean(dish.spicy),
      status: dish.status || "Available",
      description: dish.description || "",
    });
    setDishModalOpen(true);
  };

  // Save Dish (Add or Edit)
  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!dishFormData.name || !dishFormData.price) return;

    if (editingDish) {
      updateDish(editingDish.id, {
        name: dishFormData.name,
        category: dishFormData.category,
        price: Number(dishFormData.price),
        image: dishFormData.image,
        spicy: dishFormData.spicy,
        status: dishFormData.status,
        description: dishFormData.description,
      });
    } else {
      addDish({
        name: dishFormData.name,
        category: dishFormData.category,
        price: Number(dishFormData.price),
        image: dishFormData.image,
        spicy: dishFormData.spicy,
        status: dishFormData.status,
        description: dishFormData.description,
      });
    }
    setDishModalOpen(false);
  };

  // Filtered dishes for dashboard table
  const displayedDishes = useMemo(() => {
    return products.filter(
      (d) =>
        d.name?.toLowerCase().includes(dishSearch.toLowerCase()) ||
        d.category?.toLowerCase().includes(dishSearch.toLowerCase()),
    );
  }, [products, dishSearch]);

  // Safe item parser helpers
  const getOrderItemsSummary = (order) => {
    if (!order) return "";
    if (typeof order.itemsSummary === "string" && order.itemsSummary) return order.itemsSummary;
    if (typeof order.items === "string") return order.items;
    if (Array.isArray(order.items)) {
      return order.items.map((i) => `${i.name || i.title || "Dish"} x ${i.quantity || i.amount || 1}`).join(", ");
    }
    if (Array.isArray(order.itemsList)) {
      return order.itemsList.map((i) => `${i.name || i.title || "Dish"} x ${i.quantity || i.amount || 1}`).join(", ");
    }
    return "Assorted Dishes";
  };

  const getOrderItemsList = (order) => {
    if (!order) return [];
    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.itemsList)) return order.itemsList;
    if (typeof order.items === "string") {
      return order.items.split(",").map((s, idx) => ({
        id: `item-${idx}`,
        name: s.trim(),
        amount: 1,
        price: 0,
      }));
    }
    return [];
  };

  // Filtered orders for live order tracker
  const displayedOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter === "All") return true;
      return o.status?.toLowerCase() === orderFilter.toLowerCase();
    });
  }, [orders, orderFilter]);

  // Chart data calculations
  const chartData = useMemo(() => {
    try {
      // Ensure we have valid data
      if (!Array.isArray(orders) || !Array.isArray(products)) {
        return {
          orderStats: { last7Days: [], statusCounts: {} },
          menuStats: { categoryStats: [], priceDistribution: [], totalItems: 0, availableItems: 0, unavailableItems: 0 }
        };
      }

      // Calculate last 7 days data
      const last7Days = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const dayOrders = orders.filter(order => {
          if (!order || !order.date) return false;
          const orderDate = new Date(order.date);
          return orderDate.toDateString() === date.toDateString() && order.status !== 'Canceled';
        });
        
        const dayRevenue = dayOrders.reduce((sum, order) => {
          const total = typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0;
          return sum + total;
        }, 0);
        
        last7Days.push({
          date: date.toISOString(),
          orders: dayOrders.length,
          revenue: dayRevenue
        });
      }
      
      // Order status counts
      const statusCounts = orders.reduce((counts, order) => {
        if (!order || !order.status) return counts;
        const status = order.status.toLowerCase();
        counts[status] = (counts[status] || 0) + 1;
        return counts;
      }, {});
      
      // Menu category stats
      const categoryStats = products.reduce((stats, product) => {
        if (!product) return stats;
        const category = product.category || 'Other';
        const existingStat = stats.find(s => s.category === category);
        
        if (existingStat) {
          existingStat.count++;
          if (product.status === 'Available' && product.availableToday !== false) {
            existingStat.available++;
          }
        } else {
          stats.push({
            category,
            count: 1,
            available: (product.status === 'Available' && product.availableToday !== false) ? 1 : 0
          });
        }
        
        return stats;
      }, []);
      
      // Price distribution
      const priceRanges = [
        { range: '0-200', min: 0, max: 200, count: 0 },
        { range: '201-500', min: 201, max: 500, count: 0 },
        { range: '501-1000', min: 501, max: 1000, count: 0 },
        { range: '1000+', min: 1001, max: Infinity, count: 0 }
      ];
      
      products.forEach(product => {
        if (!product || !product.price) return;
        const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        const range = priceRanges.find(r => price >= r.min && price <= r.max);
        if (range) range.count++;
      });
      
      // Menu availability stats
      const availableItems = products.filter(p => p && p.status === 'Available' && p.availableToday !== false).length;
      const unavailableItems = products.length - availableItems;
      
      return {
        orderStats: {
          last7Days,
          statusCounts
        },
        menuStats: {
          categoryStats,
          priceDistribution: priceRanges,
          totalItems: products.length,
          availableItems,
          unavailableItems
        }
      };
    } catch (error) {
      console.warn('Error calculating chart data:', error);
      return {
        orderStats: { last7Days: [], statusCounts: {} },
        menuStats: { categoryStats: [], priceDistribution: [], totalItems: 0, availableItems: 0, unavailableItems: 0 }
      };
    }
  }, [orders, products]);

  const stats = [
    {
      label: "TOTAL REVENUE",
      value: adminStats.formattedRevenue,
      subtext: "+14.2% from last week",
      icon: <FiTrendingUp className="text-green-600" />,
      bg: "bg-green-50 text-green-700",
    },
    {
      label: "TOTAL ORDERS",
      value: adminStats.totalOrders.toLocaleString(),
      subtext: "Live active orders count",
      icon: <FiShoppingBag className="text-amber-600" />,
      bg: "bg-amber-50 text-amber-700",
    },
    {
      label: "AVG. ORDER VALUE",
      value: adminStats.formattedAvgOrderValue,
      subtext: "Calculated per fulfilled order",
      icon: <FiAward className="text-rose-600" />,
      bg: "bg-rose-50 text-rose-700",
    },
  ];

  const availableImages = [
    "/images/Doro.jpg",
    "/images/Tibs.jpg",
    "/images/Kitfo.jpg",
    "/images/Chechebsa.jpg",
    "/images/Dulet.jpg",
    "/images/Burger.jpg",
    "/images/Pizza.jpg",
    "/images/Lasagna.jpg",
    "/images/Mahberawi.jpg",
    "/images/Chips.jpg",
  ];

  return (
    <div className={`admin-dashboard max-w-6xl mx-auto px-4 py-6 ${isDarkMode ? 'bg-[#111b18] text-[#edf5ee]' : 'bg-[#f6efe7] text-[#1f2e28]'}`}>
      {/* Profile.jsx style header card */}
      <div className={`p-4 ${isDarkMode ? 'bg-[#182b25] border-[#2b3f37]' : 'bg-[#fffaf4] border-[#eadfc8]'} rounded-2xl border shadow-[0_12px_28px_rgba(54,38,17,0.08)] mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,#f3b63b_0%,#d56a2b_52%,#2f5d4a_100%)] text-white font-black text-xl flex items-center justify-center shadow-[0_10px_18px_rgba(212,137,44,0.25)]">
              📊
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'} mb-0.5`}>
                Admin Dashboard
              </p>
              <h1 className={`text-lg font-black ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'} leading-tight`}>
                Good day, {managerName}
              </h1>
              <span className={`text-xs ${isDarkMode ? 'text-[#dfe9df]' : 'text-[#5d6f67]'} font-medium`}>
                Real-time operations & inventory control
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenAddDish}
              className={`px-4 py-2 ${isDarkMode ? 'bg-[#2f5d4a] hover:bg-[#1e4033]' : 'bg-[#2f5d4a] hover:bg-[#1e4033]'} text-white rounded-xl text-xs font-bold transition cursor-pointer`}
            >
              + Add Dish
            </button>
          </div>
        </div>
      </div>

      {/* Profile.jsx style stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} p-4 rounded-xl border shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#20352e] text-[#f4c867]' : 'bg-[#dcf5e4] text-[#078f3b]'} flex items-center justify-center text-base`}>
              <FiTrendingUp />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Revenue
            </span>
          </div>
          <strong className={`block text-xl font-black ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'} mb-1`}>
            {adminStats.formattedRevenue}
          </strong>
          <small className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#c9d9d0]' : 'text-[#5d6f67]'}`}>
            +14.2% from last week
          </small>
        </div>

        <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} p-4 rounded-xl border shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#2b352d] text-[#f4c867]' : 'bg-[#f6e7c2] text-[#b78329]'} flex items-center justify-center text-base`}>
              <FiShoppingBag />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Orders
            </span>
          </div>
          <strong className={`block text-xl font-black ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'} mb-1`}>
            {adminStats.totalOrders.toLocaleString()}
          </strong>
          <small className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#c9d9d0]' : 'text-[#5d6f67]'}`}>
            Active orders count
          </small>
        </div>

        <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} p-4 rounded-xl border shadow-[0_10px_20px_rgba(24,35,30,0.05)] text-center hover:border-[#f0b84d] transition group`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#0f2d18] text-[#4ade80]' : 'bg-[#dcf5e4] text-[#078f3b]'} flex items-center justify-center text-base`}>
              <FiAward />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#f4c867]' : 'text-[#2f5d4a]'}`}>
              Avg Order
            </span>
          </div>
          <strong className={`block text-xl font-black ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#1f2f27]'} mb-1`}>
            {adminStats.formattedAvgOrderValue}
          </strong>
          <small className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#c9d9d0]' : 'text-[#5d6f67]'}`}>
            Per fulfilled order
          </small>
        </div>
      </div>

      {/* Charts & Analytics Section - Profile.jsx style */}
      <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} rounded-2xl border shadow-[0_10px_20px_rgba(24,35,30,0.04)] p-6 mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#20352e] text-[#f4c867]' : 'bg-[#edf5ee] text-[#2f5d4a]'} flex items-center justify-center text-base`}>
              <FiTrendingUp />
            </div>
            <div>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
                Analytics & Performance
              </p>
              <p className={`text-[10px] ${isDarkMode ? 'text-[#c4d3ca]' : 'text-[#6f7c75]'}`}>
                Real-time business insights
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 ${isDarkMode ? 'bg-[#20352e] text-[#f4c867]' : 'bg-[#dcf5e4] text-[#078f3b]'} rounded-lg text-xs font-bold flex items-center gap-1.5`}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Data
          </span>
        </div>
        
        <DashboardCharts 
          orderStats={chartData?.orderStats || {}}
          menuStats={chartData?.menuStats || {}}
          loading={false}
        />
      </div>

      {/* Section 1: Dish Inventory Management - Profile.jsx style */}
      <div className={`${isDarkMode ? 'bg-[#182b25] border-[#2d413b]' : 'bg-[#fffaf4] border-[#e8dcc5]'} rounded-2xl border shadow-[0_10px_20px_rgba(24,35,30,0.04)] overflow-hidden mb-6`}>
        <div className={`p-4 ${isDarkMode ? 'border-[#2d413b]' : 'border-[#f0e6d8]'} border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#20352e] text-[#f4c867]' : 'bg-[#edf5ee] text-[#2f5d4a]'} flex items-center justify-center text-base`}>
              🍽️
            </div>
            <div>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#24382f]'}`}>
                Dish Inventory Management
              </p>
              <p className={`text-[10px] ${isDarkMode ? 'text-[#c4d3ca]' : 'text-[#6f7c75]'}`}>
                Update dishes, prices & availability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              placeholder="Filter dishes..."
              className={`px-3 py-2 text-xs rounded-lg focus:ring-2 focus:ring-[#2f5d4a] focus:outline-none transition ${isDarkMode ? 'bg-[#14261a] border-[#2d413b] text-[#edf5ee]' : 'bg-white border-[#e8dcc5] text-[#1f2e28]'}`}
            />
            <button
              className={`px-3 py-2 ${isDarkMode ? 'bg-[#20352e] hover:bg-[#1e332e] text-[#f4c867]' : 'bg-[#edf5ee] hover:bg-[#f4efe9] text-[#2f5d4a]'} rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1`}
              onClick={handleOpenAddDish}
            >
              <FiPlus /> Add Dish
            </button>
          </div>
        </div>

        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Price</th>
                <th className="py-3 px-5">Status (Click to toggle)</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedDishes.map((dish) => {
                const isAvailable =
                  dish.availableToday !== false &&
                  dish.status !== "Out of Stock";
                return (
                  <tr key={dish.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-5 font-bold text-gray-900 flex items-center gap-3">
                      <img
                        src={dish.image || "/images/Doro.jpg"}
                        alt={dish.name}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <span>{dish.name}</span>
                        {dish.spicy && (
                          <span className="ml-1.5 text-red-500 font-normal text-[10px]">
                            🌶️ Spicy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-gray-600 font-medium">
                      {dish.category || "Traditional"}
                    </td>
                    <td className="py-3 px-5 font-bold text-gray-800">
                      ETB {dish.price}
                    </td>
                    <td className="py-3 px-5">
                      {/* Clickable 1-click Status toggle */}
                      <button
                        onClick={() => toggleDishAvailability(dish.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                          isAvailable
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        }`}
                        title="Click to toggle availability"
                      >
                        {isAvailable ? "Available" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="py-3 px-5 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEditDish(dish)}
                        className="text-green-600 hover:text-green-800 font-bold transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete "${dish.name}" from the menu?`,
                            )
                          ) {
                            deleteDish(dish.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-bold transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Live Order Tracker */}
      <section className="admin-panel bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="admin-panel-heading p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Live Order Tracker
            </h3>
            <p className="text-xs text-gray-500">
              Orders update automatically when placed from checkout. Change
              status to notify customer.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {["All", "Preparing", "Delivered", "Canceled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setOrderFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  orderFilter === tab
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Status Dropdown</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-5 font-bold text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-3 px-5 font-semibold text-gray-800">
                    <div>{order.customer}</div>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {order.phone}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-600 max-w-xs truncate" title={getOrderItemsSummary(order)}>
                    {getOrderItemsSummary(order)}
                  </td>
                  <td className="py-3 px-5 font-extrabold text-green-700">
                    ETB{" "}
                    {typeof order.total === "number"
                      ? order.total.toLocaleString()
                      : order.total}
                  </td>
                  <td className="py-3 px-5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.status === "Canceled"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="On the Way">On the Way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="py-3 px-5 text-gray-400 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-green-700 hover:bg-green-50 transition cursor-pointer"
                      title="View Order Receipt & Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL 1: Add / Edit Dish */}
      {dishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDishModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
            >
              <FiX />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingDish ? "Edit Dish Details" : "Add New Dish to Menu"}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={dishFormData.name}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, name: e.target.value })
                  }
                  placeholder="e.g. Doro Wot Special"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={dishFormData.category}
                    onChange={(e) =>
                      setDishFormData({
                        ...dishFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-800 focus:outline-none focus:border-green-500"
                  >
                    <option value="Traditional Stew">Traditional Stew</option>
                    <option value="Grilled Meat">Grilled Meat</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Main">Main</option>
                    <option value="Side">Side</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={dishFormData.price}
                    onChange={(e) =>
                      setDishFormData({
                        ...dishFormData,
                        price: e.target.value,
                      })
                    }
                    placeholder="380"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={dishFormData.status}
                  onChange={(e) =>
                    setDishFormData({ ...dishFormData, status: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-800 focus:outline-none focus:border-green-500"
                >
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Preset Image Selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Select Photo
                </label>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {availableImages.map((img) => (
                    <img
                      key={img}
                      src={img}
                      alt="Choice"
                      onClick={() =>
                        setDishFormData({ ...dishFormData, image: img })
                      }
                      className={`w-12 h-12 rounded-lg object-cover cursor-pointer border-2 transition ${
                        dishFormData.image === img
                          ? "border-green-600 scale-105"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={dishFormData.description}
                  onChange={(e) =>
                    setDishFormData({
                      ...dishFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Freshly prepared traditional spices and butter..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="spicyCheck"
                  checked={dishFormData.spicy}
                  onChange={(e) =>
                    setDishFormData({
                      ...dishFormData,
                      spicy: e.target.checked,
                    })
                  }
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <label
                  htmlFor="spicyCheck"
                  className="font-bold text-gray-700 cursor-pointer flex items-center gap-1"
                >
                  <GiChiliPepper className="text-red-500" />
                  <span>Mark as Spicy Dish</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setDishModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold cursor-pointer transition shadow-xs"
                >
                  {editingDish ? "Update Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Order Details & Receipt */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
            >
              <FiX />
            </button>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md uppercase">
                Order Receipt
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {selectedOrder.id}
              </h3>
              <p className="text-xs text-gray-500">{selectedOrder.date}</p>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Customer:</span>
                  <span>{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{selectedOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span>{selectedOrder.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-green-700">
                    {selectedOrder.paymentMethod || "Cash on Delivery"}
                  </span>
                </div>
                {selectedOrder.instructions && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
                    <strong>Note:</strong> {selectedOrder.instructions}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Order Items:</h4>
                <div className="space-y-2 border border-gray-100 rounded-xl p-3 bg-white">
                  {getOrderItemsList(selectedOrder).length > 0 ? (
                    getOrderItemsList(selectedOrder).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="font-medium text-gray-800">
                          {item.name || item.title || "Dish"}{" "}
                          <b className="text-gray-500">x {item.amount || item.quantity || 1}</b>
                        </span>
                        <span className="font-bold text-gray-900">
                          ETB {Number(item.price || 0) * (item.amount || item.quantity || 1)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-700 font-medium">
                      {getOrderItemsSummary(selectedOrder)}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>
                    ETB {selectedOrder.subtotal || selectedOrder.total}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>ETB {selectedOrder.deliveryFee ?? 100}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-green-700">
                    ETB{" "}
                    {typeof selectedOrder.total === "number"
                      ? selectedOrder.total.toLocaleString()
                      : selectedOrder.total}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({
                      ...selectedOrder,
                      status: e.target.value,
                    });
                  }}
                  className="flex-1 py-2 px-3 border border-gray-200 rounded-xl font-bold bg-white text-gray-800 focus:outline-none"
                >
                  <option value="Preparing">Status: Preparing</option>
                  <option value="On the Way">Status: On the Way</option>
                  <option value="Delivered">Status: Delivered</option>
                  <option value="Canceled">Status: Canceled</option>
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition cursor-pointer"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
