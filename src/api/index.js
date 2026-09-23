// API exports
export { default as menuApi } from './menuApi.js';
export { default as orderApi } from './orderApi.js';

// API configuration
export const API_CONFIG = {
  BASE_URL: (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// API response wrapper for consistent error handling
export class ApiResponse {
  constructor(data, error = null, loading = false) {
    this.data = data;
    this.error = error;
    this.loading = loading;
  }
  
  static loading() {
    return new ApiResponse(null, null, true);
  }
  
  static success(data) {
    return new ApiResponse(data, null, false);
  }
  
  static error(error) {
    return new ApiResponse(null, error, false);
  }
}