import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { GiChiliPepper } from "react-icons/gi";

export default function DishForm({ initialData = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [category, setCategory] = useState(
    initialData.category || "Traditional Stew"
  );
  const [price, setPrice] = useState(initialData.price || "");
  const [status, setStatus] = useState(initialData.status || "Available");
  const [spicy, setSpicy] = useState(Boolean(initialData.spicy));
  const [image, setImage] = useState(initialData.image || "/images/Doro.jpg");
  const [description, setDescription] = useState(initialData.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      price: Number(price),
      status,
      spicy,
      image,
      description,
    });
  };

  const availableImages = [
    "/images/Doro.jpg",
    "/images/Tibs.jpg",
    "/images/Kitfo.jpg",
    "/images/Chechebsa.jpg",
    "/images/Burger.jpg",
    "/images/Pizza.jpg",
    "/images/Lasagna.jpg",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 space-y-4 max-w-lg mb-6"
    >
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-gray-900">
          {initialData.name ? "Edit Dish" : "Add New Dish"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FiX />
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
          Dish Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Doro Wot"
          className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs text-gray-800 focus:border-green-500 focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs bg-white text-gray-800 focus:border-green-500 focus:outline-none"
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
            Price (ETB)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="380"
            className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs text-gray-800 focus:border-green-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs bg-white text-gray-800 focus:border-green-500 focus:outline-none"
        >
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
          Select Image
        </label>
        <div className="flex gap-2 overflow-x-auto py-1">
          {availableImages.map((img) => (
            <img
              key={img}
              src={img}
              alt="Choice"
              onClick={() => setImage(img)}
              className={`w-10 h-10 rounded-lg object-cover cursor-pointer border-2 transition ${
                image === img
                  ? "border-green-600 scale-105"
                  : "border-gray-200 opacity-60 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Authentic ingredients and traditional Ethiopian spices..."
          className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs text-gray-800 focus:border-green-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="spicyDishCheck"
          checked={spicy}
          onChange={(e) => setSpicy(e.target.checked)}
          className="rounded text-green-600 focus:ring-green-500"
        />
        <label
          htmlFor="spicyDishCheck"
          className="text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-1"
        >
          <GiChiliPepper className="text-red-500" /> Mark as Spicy Dish
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-600 cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-5 rounded-xl font-semibold text-xs hover:bg-green-700 transition shadow-sm shadow-green-600/25 cursor-pointer"
        >
          <FiCheck /> Save Dish
        </button>
      </div>
    </form>
  );
}

