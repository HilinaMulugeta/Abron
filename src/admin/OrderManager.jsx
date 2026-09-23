import React, { useState, useContext } from "react";
import { ShopContext } from "../components/ShopContext";
import { FiRefreshCw, FiEye, FiX } from "react-icons/fi";

export default function OrderManager() {
  const { orders, updateOrderStatus, simulateNewOrder } = useContext(ShopContext);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filter === "All" || o.status?.toLowerCase() === filter.toLowerCase();
    const summary = getOrderItemsSummary(o).toLowerCase();
    const matchesSearch =
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      summary.includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Live Order Tracker</h2>
          <p className="text-xs text-gray-500">
            {orders.length} total recorded customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order or customer..."
            className="text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white"
          />

          <button
            onClick={simulateNewOrder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            title="Simulate incoming order"
          >
            <FiRefreshCw className="text-xs" />
            <span>+ Simulate Order</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {["All", "Preparing", "On the Way", "Delivered", "Canceled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === tab
                  ? "bg-green-600 text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status Dropdown</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    <div>{order.customer}</div>
                    <small className="text-gray-400 font-normal">
                      {order.phone}
                    </small>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate" title={getOrderItemsSummary(order)}>
                    {getOrderItemsSummary(order)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    ETB {typeof order.total === "number" ? order.total.toLocaleString() : order.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:border-green-500 cursor-pointer font-semibold"
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="On the Way">On the Way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition cursor-pointer"
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
            >
              <FiX />
            </button>

            <div className="border-b border-gray-100 pb-3 mb-4">
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
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Items:</h4>
                <div className="border border-gray-100 rounded-xl p-3 bg-white">
                  {getOrderItemsList(selectedOrder).length > 0 ? (
                    getOrderItemsList(selectedOrder).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs py-1"
                      >
                        <span className="text-gray-800">
                          {item.name || item.title || "Dish"} <b>x {item.amount || item.quantity || 1}</b>
                        </span>
                        <span className="font-bold text-gray-900">
                          ETB {Number(item.price || 0) * (item.amount || item.quantity || 1)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div>{getOrderItemsSummary(selectedOrder)}</div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between font-extrabold text-sm text-gray-900">
                <span>Total</span>
                <span className="text-green-700">
                  ETB {typeof selectedOrder.total === "number" ? selectedOrder.total.toLocaleString() : selectedOrder.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

