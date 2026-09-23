import React, { useState, useContext } from "react";
import DishForm from "./DishForm";
import { FiPlus, FiFilter } from "react-icons/fi";
import { ShopContext } from "../components/ShopContext";

export default function DishManager() {
  const { products, addDish, updateDish, deleteDish, toggleDishAvailability } =
    useContext(ShopContext);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSave = (dishData) => {
    if (editingDish) {
      updateDish(editingDish.id, dishData);
      setEditingDish(null);
    } else {
      addDish(dishData);
      setIsAdding(false);
    }
  };

  const filtered = products.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#1f2f27] dark:text-[#f5f0e8]">
            Dish Inventory Management
          </h2>
          <p className="text-xs text-[#5d6f67] dark:text-[#c9d9d0]">
            {products.length} items on the active restaurant menu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dish..."
            className="text-xs px-3 py-2 border border-[#e8dcc5] dark:border-[#2d413b] rounded-xl focus:outline-none focus:border-[#2f5d4a] bg-[#fffaf4] dark:bg-[#14261a] text-[#1f2e28] dark:text-[#edf5ee]"
          />

          <button
            onClick={() => {
              setEditingDish(null);
              setIsAdding(!isAdding);
            }}
            className="flex items-center gap-2 bg-[#2f5d4a] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1e4033] transition shadow-sm cursor-pointer"
          >
            <FiPlus className="text-base" />{" "}
            {isAdding ? "Cancel" : "Add New Dish"}
          </button>
        </div>
      </div>

      {(isAdding || editingDish) && (
        <DishForm
          initialData={editingDish || {}}
          onSubmit={handleSave}
          onCancel={() => {
            setIsAdding(false);
            setEditingDish(null);
          }}
        />
      )}

      <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/70 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status (Click to toggle)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((dish) => {
                const isAvailable =
                  dish.availableToday !== false && dish.status !== "Out of Stock";
                return (
                  <tr key={dish.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-900 flex items-center gap-3">
                      <img
                        src={dish.image || "/images/Doro.jpg"}
                        alt={dish.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <span>{dish.name}</span>
                        {dish.spicy && (
                          <span className="ml-2 text-[10px] text-red-500 font-bold">
                            🌶️ Spicy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{dish.category}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      ETB {dish.price}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right space-x-3 font-semibold">
                      <button
                        onClick={() => {
                          setIsAdding(false);
                          setEditingDish(dish);
                        }}
                        className="text-green-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete "${dish.name}" from inventory?`
                            )
                          ) {
                            deleteDish(dish.id);
                          }
                        }}
                        className="text-red-500 hover:underline cursor-pointer"
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
    </div>
  );
}

