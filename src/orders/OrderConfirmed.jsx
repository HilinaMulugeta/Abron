import { useContext, useState } from "react";
import {
  FiCheck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiTruck,
  FiShoppingBag,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../components/ShopContext";
import MobileAppShell from "../components/MobileAppShell";

export default function OrderConfirmed() {
  const location = useLocation();
  const { orders, updateOrderStatus } = useContext(ShopContext);

  // Get active order from router state or fall back to most recent order
  const passedOrder = location.state?.order;
  const currentOrder =
    (passedOrder && orders.find((o) => o.id === passedOrder.id)) ||
    orders[0] || {
      id: "#AE-9482",
      customer: "Abebe ",
      address: "Bole Medhanialem, Addis Ababa",
      status: "Preparing",
      total: 1480,
    };

  const steps = [
    { label: "Order Placed", icon: FiCheck },
    { label: "Preparing", icon: FiClock },
    { label: "On the Way", icon: FiTruck },
    { label: "Delivered", icon: FiShoppingBag },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case "Preparing":
        return 1;
      case "On the Way":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentOrder.status);

  const handleAdvanceStatus = () => {
    const nextStatuses = ["Preparing", "On the Way", "Delivered"];
    const nextStatus =
      nextStatuses[currentStepIdx] || "Delivered";
    updateOrderStatus(currentOrder.id, nextStatus);
  };

  return (
    <MobileAppShell>
      <div className="customer-page confirmation-page max-w-[520px] mx-auto px-4 py-8 text-center">
        {/* Checkmark circle matching reference */}
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-green-50 shadow-sm animate-in zoom-in-50">
          <FiCheck />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
          Order Confirmed!
        </h1>
        <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
          Your delicious traditional hot meal is being prepared.
        </p>

        {/* Order Details Card */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs text-left space-y-2.5 text-xs text-gray-600 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-400 font-bold uppercase text-[10px]">
              Order Number
            </span>
            <strong className="text-gray-900 font-extrabold text-sm">
              {currentOrder.id}
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Est. Delivery Time</span>
            <strong className="text-green-700 font-bold">30 – 45 mins</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Delivery Location</span>
            <strong className="text-gray-900 font-semibold flex items-center gap-1">
              <FiMapPin className="text-green-600 shrink-0" />
              <span className="truncate max-w-[200px]">{currentOrder.address}</span>
            </strong>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span>Total Paid</span>
            <strong className="text-green-700 font-extrabold text-sm">
              ETB {typeof currentOrder.total === "number" ? currentOrder.total.toLocaleString() : currentOrder.total}
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Payment Method</span>
            <span className="text-gray-900 font-bold bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md text-[11px]">
              {currentOrder.paymentInfo || currentOrder.paymentMethod || "Telebirr"}
            </span>
          </div>

          {/* Ordered Items List */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
              Items Ordered
            </span>
            <div className="space-y-1">
              {(Array.isArray(currentOrder.items)
                ? currentOrder.items
                : Array.isArray(currentOrder.itemsList)
                ? currentOrder.itemsList
                : []
              ).map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-gray-700">
                  <span>
                    {item.quantity || item.amount || 1}x {item.title || item.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(item.price || 0) * (item.quantity || item.amount || 1)} ETB
                  </span>
                </div>
              ))}
              {(!currentOrder.items ||
                (Array.isArray(currentOrder.items) &&
                  currentOrder.items.length === 0)) && (
                <p className="text-xs text-gray-500 font-medium">
                  {currentOrder.itemsSummary || "Doro Wot & Traditional Stews"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live Order Status Stepper matching reference */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs mb-6 text-left">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Live Order Status
            </h3>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              {currentOrder.status}
            </span>
          </div>

          <div className="flex items-center justify-between relative px-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center gap-1 z-10"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-green-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-green-100 text-green-700 ring-2 ring-green-600 ring-offset-2"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon />
                  </div>
                  <span
                    className={`text-[9px] font-bold ${
                      isDone || isCurrent ? "text-green-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}

            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-4 h-0.5 bg-gray-200 -z-0" />
            <div
              className="absolute left-6 top-4 h-0.5 bg-green-600 transition-all duration-500 -z-0"
              style={{
                width: `${(currentStepIdx / (steps.length - 1)) * 88}%`,
              }}
            />
          </div>

          {/* Quick status advance button for simulation */}
          {currentStepIdx < steps.length - 1 && (
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={handleAdvanceStatus}
                className="text-[11px] text-green-600 font-bold hover:underline cursor-pointer"
              >
                + Advance Status for Demo (to &ldquo;{steps[currentStepIdx + 1]?.label}&rdquo;)
              </button>
            </div>
          )}
        </div>

        {/* Delivery Driver / Hero Card matching reference */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm">
              DK
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-bold text-gray-900 block">
                Dawit Kifile
              </strong>
              <span className="text-[10px] text-gray-400 block font-medium">
                Your delivery hero
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Calling driver Dawit Kifile (+251 911 888 777)...")}
              className="w-8 h-8 rounded-full bg-green-50 text-green-700 hover:bg-green-100 flex items-center justify-center text-sm transition cursor-pointer"
              title="Call driver"
              aria-label="Call driver"
            >
              <FiPhone />
            </button>
            <button
              onClick={() => toast.info("Opening live chat with driver Dawit...")}
              className="w-8 h-8 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-sm transition cursor-pointer"
              title="Message driver"
              aria-label="Message driver"
            >
              <FiMessageSquare />
            </button>
          </div>
        </div>

        {/* Action Buttons matching reference */}
        <div className="space-y-2.5">
          <Link
            to="/orders"
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md shadow-green-600/25 transition block cursor-pointer"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition block cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </MobileAppShell>
  );
}

