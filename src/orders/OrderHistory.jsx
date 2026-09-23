import { useState, useContext } from "react";
import {
  FiChevronLeft,
  FiClock,
  FiMapPin,
  FiRotateCw,
  FiCheckCircle,
  FiTruck,
  FiShoppingBag,
  FiFileText,
  FiArrowRight,
  FiX,
  FiPhone,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MobileAppShell from "../components/MobileAppShell";
import { ShopContext } from "../components/ShopContext";

function OrderHistory() {
  const { orders, updateOrderStatus, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Safe item extraction helpers to prevent crashes with string/array items
  const getOrderItemsList = (order) => {
    if (Array.isArray(order?.items)) return order.items;
    if (Array.isArray(order?.itemsList)) return order.itemsList;
    if (typeof order?.items === "string") {
      return order.items.split(",").map((s, idx) => {
        const parts = s.trim().split("x");
        const name = parts[0]?.trim() || "Delicious Dish";
        const qty = parseInt(parts[1]?.trim(), 10) || 1;
        return {
          id: `item-${idx}`,
          name,
          title: name,
          quantity: qty,
          amount: qty,
          price: 350,
        };
      });
    }
    return [];
  };

  const getOrderItemsSummary = (order) => {
    if (order?.itemsSummary) return order.itemsSummary;
    if (typeof order?.items === "string") return order.items;
    if (Array.isArray(order?.items)) {
      return order.items
        .map(
          (i) =>
            `${i.name || i.title || "Dish"} x ${i.quantity || i.amount || 1}`
        )
        .join(", ");
    }
    return "Traditional Ethiopian Meal";
  };

  // Active vs Past orders
  const activeOrders = orders.filter(
    (o) => o.status === "Placed" || o.status === "Preparing" || o.status === "On the Way"
  );
  const pastOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Canceled"
  );

  // Next status progression helper for demo
  const getNextStatus = (current) => {
    switch (current) {
      case "Placed":
        return "Preparing";
      case "Preparing":
        return "On the Way";
      case "On the Way":
        return "Delivered";
      default:
        return "Delivered";
    }
  };

  const handleAdvanceStatus = (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    updateOrderStatus(orderId, nextStatus);
    toast.info(`Order ${orderId} updated to: ${nextStatus}`);
  };

  const handleReorder = (order) => {
    const itemsToOrder = getOrderItemsList(order);
    if (!itemsToOrder || itemsToOrder.length === 0) return;
    itemsToOrder.forEach((item) => {
      const liveDish = products.find((p) => String(p.id) === String(item.id)) || item;
      const count = item.quantity || item.amount || 1;
      addToCart(liveDish, liveDish.id, count);
    });
    toast.success(`Items from order ${order.id} added to cart!`);
    navigate("/cart");
  };

  return (
    <MobileAppShell>
      <div className="customer-page max-w-2xl mx-auto px-4 py-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-green-700 transition"
          >
            <FiChevronLeft className="text-base" /> Back to menu
          </Link>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            {orders.length} Total Orders
          </span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-6">Order History</h1>

        {/* ACTIVE ORDERS SECTION */}
        {activeOrders.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-green-700">
                Active Orders ({activeOrders.length})
              </h2>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress
              </span>
            </div>

            <div className="space-y-4">
              {activeOrders.map((order) => {
                const isPlaced = true;
                const isPreparing =
                  order.status === "Preparing" || order.status === "On the Way" || order.status === "Delivered";
                const isOnTheWay =
                  order.status === "On the Way" || order.status === "Delivered";
                const isDelivered = order.status === "Delivered";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border-2 border-green-500/30 p-5 shadow-xs transition hover:border-green-500/60"
                  >
                    {/* Card Top Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">
                          Current Order
                        </span>
                        <strong className="text-base font-black text-gray-900">
                          {order.id}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          <FiClock className="text-xs" /> {order.status}
                        </span>
                        <span className="text-xs font-black text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg">
                          {order.total} ETB
                        </span>
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 bg-gray-50 p-2.5 rounded-xl">
                      <FiMapPin className="text-green-600 shrink-0 text-base" />
                      <div className="truncate">
                        <span className="text-gray-400 text-[10px] block">
                          Delivering to:
                        </span>
                        <strong className="text-gray-800 font-semibold">
                          {order.address || "23 Bole Road, Addis Ababa"}
                        </strong>
                      </div>
                    </div>

                    {/* Live Progress Stepper */}
                    <div className="order-progress my-5">
                      <div className={`progress-step ${isPlaced ? "is-done" : ""}`}>
                        <span>✓</span>
                        <small>Placed</small>
                      </div>
                      <div className={`progress-line ${isPreparing ? "is-done" : ""}`} />
                      <div
                        className={`progress-step ${
                          order.status === "Preparing"
                            ? "is-current"
                            : isPreparing
                            ? "is-done"
                            : ""
                        }`}
                      >
                        <span>
                          <FiClock />
                        </span>
                        <small>Preparing</small>
                      </div>
                      <div className={`progress-line ${isOnTheWay ? "is-done" : ""}`} />
                      <div
                        className={`progress-step ${
                          order.status === "On the Way"
                            ? "is-current"
                            : isOnTheWay
                            ? "is-done"
                            : ""
                        }`}
                      >
                        <span>
                          <FiTruck />
                        </span>
                        <small>On the Way</small>
                      </div>
                      <div className={`progress-line ${isDelivered ? "is-done" : ""}`} />
                      <div className={`progress-step ${isDelivered ? "is-done" : ""}`}>
                        <span>
                          <FiCheckCircle />
                        </span>
                        <small>Delivered</small>
                      </div>
                    </div>

                    {/* Ordered Items Summary */}
                    <div className="border-t border-gray-100 pt-3 mb-4">
                      <p className="text-[11px] font-bold text-gray-400 mb-1.5 uppercase">
                        Items Ordered:
                      </p>
                      <div className="space-y-1">
                        {getOrderItemsList(order).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs text-gray-700"
                          >
                            <span>
                              {item.quantity || item.amount || 1}x {item.title || item.name}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {(item.price || 0) * (item.quantity || item.amount || 1)} ETB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <Link
                        to="/order-confirmed"
                        className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:text-green-800 transition"
                      >
                        View Driver Card & Live Map <FiArrowRight />
                      </Link>

                      {/* Demo progression button */}
                      <button
                        onClick={() => handleAdvanceStatus(order.id, order.status)}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-green-200"
                        title="Simulate driver moving forward in delivery flow"
                      >
                        <FiRotateCw className="text-xs" /> Advance Status (Demo)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PAST ORDERS SECTION */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">
              Past Orders ({pastOrders.length})
            </h2>
          </div>

          {pastOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3 text-xl">
                <FiShoppingBag />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                No past orders yet
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                Your past meals and receipts will appear here once delivered.
              </p>
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:border-gray-200 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-black text-gray-900">
                        {order.id}
                      </strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      {order.total} ETB
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    {getOrderItemsSummary(order)}
                    {" · "}
                    <span className="text-gray-400 text-[11px]">
                      {order.date || "Delivered"}
                    </span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedReceipt(order)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition cursor-pointer"
                    >
                      <FiFileText className="text-xs" /> View Receipt
                    </button>
                    <button
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                    >
                      <FiRotateCw className="text-xs" /> Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECEIPT MODAL */}
        {selectedReceipt && (
          <div
            className="profile-modal-backdrop"
            onClick={() => setSelectedReceipt(null)}
          >
            <div
              className="profile-modal bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="profile-modal-close"
                onClick={() => setSelectedReceipt(null)}
              >
                <FiX />
              </button>

              <div className="text-center pb-4 border-b border-gray-100">
                <span className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-black text-lg inline-flex items-center justify-center mb-2">
                  A
                </span>
                <h2 className="text-base font-black text-gray-900 mb-0.5">
                  Abron Receipt
                </h2>
                <p className="text-xs text-gray-500">Order {selectedReceipt.id}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {selectedReceipt.date || "Order completed"}
                </p>
              </div>

              <div className="py-4 border-b border-gray-100 space-y-2">
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Ordered Dishes
                </p>
                {getOrderItemsList(selectedReceipt).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-gray-700"
                  >
                    <span>
                      {item.quantity || item.amount || 1}x {item.title || item.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {(item.price || 0) * (item.quantity || item.amount || 1)} ETB
                    </span>
                  </div>
                ))}
              </div>

              <div className="py-4 border-b border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <strong className="text-gray-900">
                    {selectedReceipt.payment || "Cash on Delivery"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="text-gray-900 text-right truncate max-w-[160px]">
                    {selectedReceipt.address || "23 Bole Road, Addis Ababa"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-black text-gray-900">
                  <span>Total Paid:</span>
                  <span className="text-green-700">{selectedReceipt.total} ETB</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleReorder(selectedReceipt);
                    setSelectedReceipt(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-xs flex items-center justify-center gap-1"
                >
                  <FiRotateCw className="text-xs" /> Reorder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileAppShell>
  );
}

export default OrderHistory;

