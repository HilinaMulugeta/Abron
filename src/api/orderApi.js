// API layer for order operations
const simulateApiDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

class OrderAPI {
  constructor() {
    // Simulate order storage (in real app, this would be server-side)
    this.orders = this.loadOrdersFromStorage();
    this.orderIdCounter = this.orders.length > 0 ? Math.max(...this.orders.map(o => parseInt(o.id.split('-')[1]))) + 1 : 1;
  }
  
  loadOrdersFromStorage() {
    try {
      const stored = localStorage.getItem('abron_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  saveOrdersToStorage() {
    try {
      localStorage.setItem('abron_orders', JSON.stringify(this.orders));
    } catch (error) {
      console.warn('Failed to save orders to storage:', error);
    }
  }
  
  // Create new order
  async createOrder(orderData) {
    await simulateApiDelay(1000);
    
    const order = {
      id: `order-${this.orderIdCounter++}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: this.calculateEstimatedDelivery()
    };
    
    this.orders.unshift(order); // Add to beginning
    this.saveOrdersToStorage();
    
    return order;
  }
  
  // Get orders for a user
  async getUserOrders(userId, page = 1, limit = 10) {
    await simulateApiDelay(500);
    
    const userOrders = this.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const totalItems = userOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const orders = userOrders.slice(startIndex, startIndex + limit);
    
    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    };
  }
  
  // Get single order
  async getOrder(orderId) {
    await simulateApiDelay(300);
    
    const order = this.orders.find(order => order.id === orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    return order;
  }
  
  // Update order status (admin)
  async updateOrderStatus(orderId, status) {
    await simulateApiDelay(400);
    
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    this.orders[orderIndex].status = status;
    this.orders[orderIndex].updatedAt = new Date().toISOString();
    
    // Update estimated delivery if status changes
    if (status === 'confirmed') {
      this.orders[orderIndex].estimatedDelivery = this.calculateEstimatedDelivery();
    } else if (status === 'delivered') {
      this.orders[orderIndex].deliveredAt = new Date().toISOString();
    }
    
    this.saveOrdersToStorage();
    return this.orders[orderIndex];
  }
  
  // Get all orders (admin)
  async getAllOrders(page = 1, limit = 20, status = 'all') {
    await simulateApiDelay(600);
    
    let filteredOrders = [...this.orders];
    
    if (status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const orders = filteredOrders.slice(startIndex, startIndex + limit);
    
    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    };
  }
  
  // Get order statistics (admin)
  async getOrderStats() {
    await simulateApiDelay(400);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter orders by time periods
    const todayOrders = this.orders.filter(order => 
      new Date(order.createdAt) >= today
    );
    const weekOrders = this.orders.filter(order => 
      new Date(order.createdAt) >= thisWeek
    );
    const monthOrders = this.orders.filter(order => 
      new Date(order.createdAt) >= thisMonth
    );
    
    // Status distribution
    const statusCounts = this.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    // Revenue calculations
    const totalRevenue = this.orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    const monthlyRevenue = monthOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Daily orders for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayOrders = this.orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayOrders
          .filter(order => order.status !== 'cancelled')
          .reduce((sum, order) => sum + (order.total || 0), 0)
      };
    }).reverse();
    
    return {
      totalOrders: this.orders.length,
      todayOrders: todayOrders.length,
      weekOrders: weekOrders.length,
      monthOrders: monthOrders.length,
      statusCounts,
      totalRevenue,
      monthlyRevenue,
      averageOrderValue: this.orders.length > 0 ? Math.round(totalRevenue / this.orders.length) : 0,
      last7Days
    };
  }
  
  calculateEstimatedDelivery() {
    const now = new Date();
    const deliveryTime = 30 + Math.random() * 30; // 30-60 minutes
    return new Date(now.getTime() + deliveryTime * 60000).toISOString();
  }
}

// Create singleton instance
const orderApi = new OrderAPI();
export default orderApi;