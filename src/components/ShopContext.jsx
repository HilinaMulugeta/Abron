import { createContext, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const INITIAL_ORDERS = [
  {
    id: "#AE-9482",
    customer: "Solomon Alelu",
    phone: "+251 911 234 567",
    address: "Bole Medhanialem, Addis Ababa",
    area: "Bole",
    items: [
      {
        id: "dish-1",
        name: "Doro Wot",
        title: "Doro Wot",
        amount: 1,
        quantity: 1,
        price: 380,
        image: "/images/Doro.jpg",
      },
      {
        id: "dish-9",
        name: "Beef Tibs",
        title: "Beef Tibs",
        amount: 2,
        quantity: 2,
        price: 300,
        image: "/images/Tibs.jpg",
      },
    ],
    itemsList: [
      {
        id: "dish-1",
        name: "Doro Wot",
        title: "Doro Wot",
        amount: 1,
        quantity: 1,
        price: 380,
        image: "/images/Doro.jpg",
      },
      {
        id: "dish-9",
        name: "Beef Tibs",
        title: "Beef Tibs",
        amount: 2,
        quantity: 2,
        price: 300,
        image: "/images/Tibs.jpg",
      },
    ],
    itemsSummary: "Doro Wot x 1, Beef Tibs x 2",
    subtotal: 980,
    deliveryFee: 100,
    discount: 0,
    total: 1480,
    status: "Preparing",
    date: "Today, 12:40 PM",
    paymentMethod: "Cash on Delivery",
    instructions: "Please bring extra spicy Awaze sauce",
  },
  {
    id: "#AE-9481",
    customer: "Helen Tesfaye",
    phone: "+251 922 456 789",
    address: "Kazanchis, Addis Ababa",
    area: "Kazanchis",
    items: [
      {
        id: "dish-2",
        name: "Chechebsa",
        title: "Chechebsa",
        amount: 2,
        quantity: 2,
        price: 400,
        image: "/images/Chechebsa.jpg",
      },
      {
        id: "dish-5",
        name: "Dulet",
        title: "Dulet",
        amount: 1,
        quantity: 1,
        price: 500,
        image: "/images/Dulet.jpg",
      },
    ],
    itemsList: [
      {
        id: "dish-2",
        name: "Chechebsa",
        title: "Chechebsa",
        amount: 2,
        quantity: 2,
        price: 400,
        image: "/images/Chechebsa.jpg",
      },
      {
        id: "dish-5",
        name: "Dulet",
        title: "Dulet",
        amount: 1,
        quantity: 1,
        price: 500,
        image: "/images/Dulet.jpg",
      },
    ],
    itemsSummary: "Chechebsa x 2, Dulet x 1",
    subtotal: 1300,
    deliveryFee: 100,
    discount: 0,
    total: 1400,
    status: "Delivered",
    date: "Today, 11:15 AM",
    paymentMethod: "Telebirr",
    instructions: "",
  },
  {
    id: "#AE-9480",
    customer: "Yonas Kebede",
    phone: "+251 933 678 901",
    address: "Sarbet, Addis Ababa",
    area: "Sarbet",
    items: [
      {
        id: "dish-16",
        name: "Special Pizza",
        title: "Special Pizza",
        amount: 1,
        quantity: 1,
        price: 1000,
        image: "/images/Pizza.jpg",
      },
    ],
    itemsList: [
      {
        id: "dish-16",
        name: "Special Pizza",
        title: "Special Pizza",
        amount: 1,
        quantity: 1,
        price: 1000,
        image: "/images/Pizza.jpg",
      },
    ],
    itemsSummary: "Special Pizza x 1",
    subtotal: 1000,
    deliveryFee: 100,
    discount: 100,
    total: 1000,
    status: "Canceled",
    date: "Yesterday",
    paymentMethod: "Card Payment",
    instructions: "",
  },
];

const ShopContextProvider = ({ children }) => {
  // Dishes / Products state
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("abron_dishes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state with auto-repair for string items
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("abron_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((o) => {
            const itemsArr = Array.isArray(o.items)
              ? o.items
              : Array.isArray(o.itemsList)
                ? o.itemsList
                : [
                    {
                      id: "dish-1",
                      name:
                        typeof o.items === "string"
                          ? o.items.split("x")[0]?.trim() || "Doro Wot"
                          : "Ethiopian Dish",
                      title:
                        typeof o.items === "string"
                          ? o.items.split("x")[0]?.trim() || "Doro Wot"
                          : "Ethiopian Dish",
                      amount: 1,
                      quantity: 1,
                      price: o.total || 450,
                      image: "/images/Doro.jpg",
                    },
                  ];
            return {
              ...o,
              items: itemsArr,
              itemsList: itemsArr,
              itemsSummary:
                typeof o.items === "string"
                  ? o.items
                  : o.itemsSummary || "Delicious Ethiopian Dishes",
            };
          });
        }
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("abron_favorites");
      return saved ? JSON.parse(saved) : ["dish-1", "dish-4"];
    } catch {
      return ["dish-1", "dish-4"];
    }
  });

  const normalizeCartItem = (item, fallbackQty = 1) => {
    const safeQty = Number(item?.quantity ?? item?.amount ?? fallbackQty);
    const validQty =
      Number.isFinite(safeQty) && safeQty > 0 ? safeQty : fallbackQty;
    return {
      ...item,
      quantity: validQty,
      amount: validQty,
    };
  };

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("abron_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.map((item) => normalizeCartItem(item, 1))
        : [];
    } catch {
      return [];
    }
  });

  // Promo code state
  const [promo, setPromo] = useState(() => {
    try {
      const saved = localStorage.getItem("abron_promo");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Initial dishes loading and category normalization
  useEffect(() => {
    fetch("/menu-data.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts((prev) => {
          if (prev.length === 0) {
            const normalized = data.map((d) => ({
              ...d,
              category: d.name?.toLowerCase().includes("burger")
                ? "Burgers"
                : d.name?.toLowerCase().includes("pizza")
                  ? "Pizza"
                  : d.category,
              availableToday: d.availableToday !== false,
              status: d.availableToday !== false ? "Available" : "Out of Stock",
            }));
            localStorage.setItem("abron_dishes", JSON.stringify(normalized));
            return normalized;
          }
          // Ensure Burger and Pizza categories are updated if previously set to Main
          const updated = prev.map((d) => ({
            ...d,
            category:
              d.name?.toLowerCase().includes("burger") &&
              (d.category === "Main" || !d.category)
                ? "Burgers"
                : d.name?.toLowerCase().includes("pizza") &&
                    (d.category === "Main" || !d.category)
                  ? "Pizza"
                  : d.category,
          }));
          localStorage.setItem("abron_dishes", JSON.stringify(updated));
          return updated;
        });
      })
      .catch((err) => console.error("Error loading menu data:", err));
  }, []);

  // Persist products
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("abron_dishes", JSON.stringify(products));
    }
  }, [products]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem("abron_orders", JSON.stringify(orders));
  }, [orders]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("abron_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("abron_cart", JSON.stringify(cart));
  }, [cart]);

  // Persist promo
  useEffect(() => {
    if (promo) {
      localStorage.setItem("abron_promo", JSON.stringify(promo));
    } else {
      localStorage.removeItem("abron_promo");
    }
  }, [promo]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.amount ?? item.quantity ?? 1) || 1;
      return acc + price * qty;
    }, 0);
  }, [cart]);

  // Total quantity in cart
  const quantity = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + (Number(item.amount ?? item.quantity ?? 1) || 1),
      0,
    );
  }, [cart]);

  const [selectedArea, setSelectedArea] = useState("Bole");

  // Delivery fee calculator by Addis Ababa sub-city / area (Feature 20)
  const AREA_DELIVERY_FEES = {
    Bole: 80,
    Kazanchis: 100,
    Sarbet: 110,
    Piassa: 120,
    Gerji: 130,
    CMC: 150,
  };

  const getDeliveryFeeForArea = (area) => {
    if (!area) return 80;
    return AREA_DELIVERY_FEES[area] || 100;
  };

  // Delivery fee logic
  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (promo?.type === "free_shipping") return 0;
    return getDeliveryFeeForArea(selectedArea);
  }, [subtotal, promo, selectedArea]);

  // Discount calculation
  const discount = useMemo(() => {
    if (!promo || subtotal === 0) return 0;
    if (promo.percent) {
      return Math.round((subtotal * promo.percent) / 100);
    }
    if (promo.amount) {
      return Math.min(subtotal, promo.amount);
    }
    return 0;
  }, [subtotal, promo]);

  // Grand Total
  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [subtotal, deliveryFee, discount]);

  // Dynamically computed Admin KPIs
  const adminStats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "Canceled");
    const totalRev = validOrders.reduce((acc, o) => {
      const numericTotal =
        typeof o.total === "string"
          ? parseFloat(o.total.replace(/[^0-9.]/g, "")) || 0
          : Number(o.total) || 0;
      return acc + numericTotal;
    }, 0);

    const totalCount = orders.length;
    const avgOrderVal =
      validOrders.length > 0 ? Math.round(totalRev / validOrders.length) : 0;

    return {
      totalRevenue: totalRev,
      formattedRevenue: `ETB ${totalRev.toLocaleString()}`,
      totalOrders: totalCount,
      avgOrderValue: avgOrderVal,
      formattedAvgOrderValue: `ETB ${avgOrderVal.toLocaleString()}`,
    };
  }, [orders]);

  // Helper to verify dish availability
  const isDishAvailable = (dish) => {
    if (!dish) return false;
    if (dish.availableToday === false) return false;
    if (dish.status === "Out of Stock") return false;
    return true;
  };

  // Cart actions with out-of-stock guard
  const addToCart = (product, id = product?.id, quantityToAdd = 1) => {
    if (!product) return false;

    // Check if the dish is currently available
    const liveDish =
      products.find((p) => String(p.id) === String(id)) || product;
    if (!isDishAvailable(liveDish)) {
      toast.error(`"${liveDish.name}" is currently unavailable today!`);
      return false;
    }

    const qty =
      typeof quantityToAdd === "number" && quantityToAdd > 0
        ? quantityToAdd
        : 1;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => String(item.id) === String(id));
      if (existing) {
        const nextQuantity =
          (Number(existing.amount ?? existing.quantity ?? 1) || 1) + qty;
        const updatedCart = prevCart.map((item) =>
          String(item.id) === String(id)
            ? normalizeCartItem(
                { ...item, amount: nextQuantity, quantity: nextQuantity },
                nextQuantity,
              )
            : item,
        );
        toast.success(`Updated quantity for ${liveDish.name}`);
        return updatedCart;
      }

      const newItem = normalizeCartItem(
        { ...liveDish, amount: qty, quantity: qty },
        qty,
      );
      toast.success(`${liveDish.name} added to cart!`);
      return [...prevCart, newItem];
    });

    return true;
  };

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => String(item.id) !== String(id)),
    );
    toast.info("Item removed from cart");
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (String(item.id) !== String(id)) return item;
        const nextQuantity =
          (Number(item.amount ?? item.quantity ?? 1) || 1) + 1;
        return normalizeCartItem(
          { ...item, amount: nextQuantity, quantity: nextQuantity },
          nextQuantity,
        );
      }),
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) => {
      const item = prevCart.find((it) => String(it.id) === String(id));
      if (!item) return prevCart;

      const currentQuantity = Number(item.amount ?? item.quantity ?? 1) || 1;
      if (currentQuantity <= 1) {
        toast.info("Item removed from cart");
        return prevCart.filter((it) => String(it.id) !== String(id));
      }

      return prevCart.map((it) => {
        if (String(it.id) !== String(id)) return it;
        const nextQuantity = currentQuantity - 1;
        return normalizeCartItem(
          { ...it, amount: nextQuantity, quantity: nextQuantity },
          nextQuantity,
        );
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  // Promo code system
  const applyPromoCode = (code) => {
    if (!code || typeof code !== "string") return false;
    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === "ABRON20") {
      setPromo({ code: "ABRON20", percent: 20, label: "20% Weekend Discount" });
      toast.success("Promo code ABRON20 applied! 20% discount applied.");
      return true;
    }
    if (cleanCode === "HABESHA10") {
      setPromo({
        code: "HABESHA10",
        percent: 10,
        label: "10% Special Discount",
      });
      toast.success("Promo code HABESHA10 applied! 10% discount applied.");
      return true;
    }
    if (cleanCode === "FREESHIP") {
      setPromo({
        code: "FREESHIP",
        type: "free_shipping",
        label: "Free Delivery",
      });
      toast.success("Free delivery promo code applied!");
      return true;
    }

    toast.error("Invalid promo code. Try ABRON20, HABESHA10, or FREESHIP");
    return false;
  };

  const removePromoCode = () => {
    setPromo(null);
    toast.info("Promo code removed");
  };

  // Favorites
  const toggleFavorite = (productId) => {
    const strId = String(productId);
    if (favorites.includes(strId)) {
      setFavorites(favorites.filter((id) => id !== strId));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, strId]);
      toast.success("Added to favorites! ❤️");
    }
  };

  const isFavorite = (productId) => favorites.includes(String(productId));

  // Dish Inventory CRUD (Admin and Frontend)
  const addDish = (dishData) => {
    const newId = `dish-${Date.now()}`;
    const newDish = {
      id: newId,
      name: dishData.name,
      category: dishData.category || "Traditional Stew",
      price: Number(dishData.price) || 250,
      image: dishData.image || "/images/Doro.jpg",
      spicy: Boolean(dishData.spicy),
      availableToday: dishData.status !== "Out of Stock",
      status: dishData.status || "Available",
      description:
        dishData.description ||
        "Delicious authentic recipe made with traditional Ethiopian spices and ingredients.",
    };

    setProducts((prev) => [newDish, ...prev]);
    toast.success(`Dish "${newDish.name}" added successfully!`);
    return newDish;
  };

  const updateDish = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((dish) => {
        if (String(dish.id) === String(id)) {
          const status =
            updatedData.status !== undefined
              ? updatedData.status
              : updatedData.availableToday === false
                ? "Out of Stock"
                : "Available";
          const availableToday =
            updatedData.availableToday !== undefined
              ? updatedData.availableToday
              : status !== "Out of Stock";

          return {
            ...dish,
            ...updatedData,
            status,
            availableToday,
          };
        }
        return dish;
      }),
    );
    toast.success("Dish updated successfully!");
  };

  const deleteDish = (id) => {
    setProducts((prev) =>
      prev.filter((dish) => String(dish.id) !== String(id)),
    );
    toast.success("Dish deleted successfully!");
  };

  const toggleDishAvailability = (id) => {
    setProducts((prev) =>
      prev.map((dish) => {
        if (String(dish.id) === String(id)) {
          const isNowAvailable = !isDishAvailable(dish);
          const newStatus = isNowAvailable ? "Available" : "Out of Stock";
          toast.info(`"${dish.name}" is now marked as ${newStatus}`);
          return {
            ...dish,
            availableToday: isNowAvailable,
            status: newStatus,
          };
        }
        return dish;
      }),
    );
  };

  // Orders Management CRUD
  const addOrder = (orderData) => {
    const orderNum = `#AE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const itemsArray =
      cart.length > 0
        ? cart.map((it) => {
            const itemQty = Number(it.amount ?? it.quantity ?? 1) || 1;
            return {
              id: it.id,
              name: it.name,
              title: it.name,
              amount: itemQty,
              quantity: itemQty,
              price: it.price || 0,
              image: it.image || it.img || "/images/Doro.jpg",
            };
          })
        : [
            {
              id: "dish-1",
              name: "Doro Wot Special",
              title: "Doro Wot Special",
              amount: 1,
              quantity: 1,
              price: total || 1350,
              image: "/images/Doro.jpg",
            },
          ];

    const itemsSummary =
      itemsArray
        .map((it) => `${it.name} x ${it.amount ?? it.quantity ?? 1}`)
        .join(", ") || "Traditional Ethiopian Dishes";

    const newOrder = {
      id: orderNum,
      customer: orderData.customer || "Abebe Kebede",
      phone: orderData.phone || "+251 911 234 567",
      address: orderData.address || "Bole Medhanialem, Addis Ababa",
      area: orderData.area || "Bole",
      items: itemsArray,
      itemsList: itemsArray,
      itemsSummary,
      subtotal,
      deliveryFee,
      discount,
      total: total > 0 ? total : 1350,
      status: "Preparing",
      date: timeString,
      paymentMethod: orderData.paymentMethod || "Cash on Delivery",
      instructions: orderData.instructions || "",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    toast.success(`Order ${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    toast.success(`Order ${orderId} updated to: ${newStatus}`);
  };

  // Quick order simulator for testing dynamic dashboard
  const simulateNewOrder = () => {
    const sampleCustomers = [
      { name: "Almaz Kebede", phone: "+251 912 345 678", area: "Kazanchis" },
      { name: "Dawit Haile", phone: "+251 913 456 789", area: "Piassa" },
      { name: "Selamawit Bekele", phone: "+251 914 567 890", area: "Bole" },
      { name: "Kidus Tadesse", phone: "+251 915 678 901", area: "Sarbet" },
      { name: "Tigist Alemu", phone: "+251 916 789 012", area: "CMC" },
    ];
    const customer =
      sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
    const randomDish1 = products[0] || { name: "Doro Wot", price: 380 };
    const randomDish2 = products[1] || { name: "Beef Tibs", price: 300 };

    const orderNum = `#AE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const itemsCost =
      (Number(randomDish1.price) || 380) + (Number(randomDish2.price) || 300);
    const simItems = [
      {
        id: randomDish1.id || "dish-1",
        name: randomDish1.name,
        title: randomDish1.name,
        amount: 1,
        quantity: 1,
        price: randomDish1.price,
      },
      {
        id: randomDish2.id || "dish-2",
        name: randomDish2.name,
        title: randomDish2.name,
        amount: 1,
        quantity: 1,
        price: randomDish2.price,
      },
    ];
    const simOrder = {
      id: orderNum,
      customer: customer.name,
      phone: customer.phone,
      address: `${customer.area}, Addis Ababa`,
      area: customer.area,
      items: simItems,
      itemsList: simItems,
      itemsSummary: `${randomDish1.name} x 1, ${randomDish2.name} x 1`,
      subtotal: itemsCost,
      deliveryFee: 100,
      discount: 0,
      total: itemsCost + 100,
      status: "Preparing",
      date: timeString,
      paymentMethod: "Cash on Delivery",
      instructions: "Simulated live customer order",
    };

    setOrders((prev) => [simOrder, ...prev]);
    toast.success(`🎉 New Live Order received from ${customer.name}!`);
    return simOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        favorites,
        promo,
        quantity,
        subtotal,
        deliveryFee,
        discount,
        total,
        selectedArea,
        setSelectedArea,
        getDeliveryFeeForArea,
        AREA_DELIVERY_FEES,
        adminStats,
        isDishAvailable,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        toggleFavorite,
        isFavorite,
        addDish,
        updateDish,
        deleteDish,
        toggleDishAvailability,
        addOrder,
        updateOrderStatus,
        simulateNewOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
