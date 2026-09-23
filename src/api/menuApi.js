// API layer for menu operations
import menuData from './menu-data.json';

// Simulate API delay for realistic loading states
const simulateApiDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

class MenuAPI {
  // Get all menu items with optional filtering and pagination
  async getMenuItems(options = {}) {
    await simulateApiDelay();
    
    const { 
      category, 
      search, 
      page = 1, 
      limit = 12, 
      sortBy = 'name',
      sortOrder = 'asc',
      availableOnly = false 
    } = options;
    
    let filteredData = [...menuData];
    
    // Filter by availability
    if (availableOnly) {
      filteredData = filteredData.filter(item => item.availableToday);
    }
    
    // Filter by category
    if (category && category !== 'all') {
      filteredData = filteredData.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort items
    filteredData.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Calculate pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredData.slice(startIndex, endIndex);
    
    return {
      items,
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
  
  // Get single menu item by ID
  async getMenuItem(id) {
    await simulateApiDelay(300);
    
    const item = menuData.find(item => item.id === id);
    if (!item) {
      throw new Error(`Menu item with ID ${id} not found`);
    }
    
    return item;
  }
  
  // Get menu categories
  async getCategories() {
    await simulateApiDelay(200);
    
    const categories = [...new Set(menuData.map(item => item.category))];
    return categories.sort();
  }
  
  // Get featured items (popular or recommended)
  async getFeaturedItems(limit = 6) {
    await simulateApiDelay(400);
    
    // For demo, return available items sorted by price (assuming higher price = more popular)
    const featuredItems = menuData
      .filter(item => item.availableToday)
      .sort((a, b) => b.price - a.price)
      .slice(0, limit);
      
    return featuredItems;
  }
  
  // Search menu items
  async searchMenuItems(query, options = {}) {
    return this.getMenuItems({ ...options, search: query });
  }
  
  // Get menu statistics (for admin dashboard)
  async getMenuStats() {
    await simulateApiDelay(300);
    
    const totalItems = menuData.length;
    const availableItems = menuData.filter(item => item.availableToday).length;
    const categories = [...new Set(menuData.map(item => item.category))];
    
    // Calculate stats by category
    const categoryStats = categories.map(category => {
      const categoryItems = menuData.filter(item => item.category === category);
      return {
        category,
        count: categoryItems.length,
        available: categoryItems.filter(item => item.availableToday).length,
        averagePrice: Math.round(
          categoryItems.reduce((sum, item) => sum + item.price, 0) / categoryItems.length
        )
      };
    });
    
    // Price distribution
    const priceRanges = [
      { range: '0-500', min: 0, max: 500 },
      { range: '501-1000', min: 501, max: 1000 },
      { range: '1001-1500', min: 1001, max: 1500 },
      { range: '1501+', min: 1501, max: Infinity }
    ];
    
    const priceDistribution = priceRanges.map(range => ({
      range: range.range,
      count: menuData.filter(item => 
        item.price >= range.min && item.price <= range.max
      ).length
    }));
    
    return {
      totalItems,
      availableItems,
      unavailableItems: totalItems - availableItems,
      totalCategories: categories.length,
      categoryStats,
      priceDistribution,
      averagePrice: Math.round(
        menuData.reduce((sum, item) => sum + item.price, 0) / totalItems
      ),
      spicyItemsCount: menuData.filter(item => item.spicy).length
    };
  }
}

// Create singleton instance
const menuApi = new MenuAPI();
export default menuApi;