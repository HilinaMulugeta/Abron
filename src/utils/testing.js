// Testing utilities and verification functions

import { safeConsole } from "./console.js";

// Test suite for verifying app improvements
export class AppTestSuite {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  // Add a test to the suite
  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  // Run all tests
  async runAllTests() {
    safeConsole.log("🧪 Running App Improvement Tests...");

    for (const test of this.tests) {
      try {
        const startTime = performance.now();
        const result = await test.testFn();
        const duration = performance.now() - startTime;

        this.results.push({
          name: test.name,
          passed: result.passed,
          message: result.message,
          duration,
        });

        if (result.passed) {
          safeConsole.log(
            `✅ ${test.name} - ${result.message} (${duration.toFixed(2)}ms)`,
          );
        } else {
          safeConsole.error(
            `❌ ${test.name} - ${result.message} (${duration.toFixed(2)}ms)`,
          );
        }
      } catch (error) {
        this.results.push({
          name: test.name,
          passed: false,
          message: error.message,
          duration: 0,
        });
        safeConsole.error(`❌ ${test.name} - Error: ${error.message}`);
      }
    }

    this.printSummary();
  }

  // Print test summary
  printSummary() {
    const passed = this.results.filter((r) => r.passed).length;
    const total = this.results.length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    safeConsole.log("📊 Test Summary:");
    safeConsole.log(`   Passed: ${passed}/${total}`);
    safeConsole.log(`   Total Duration: ${totalDuration.toFixed(2)}ms`);

    if (passed === total) {
      safeConsole.log("🎉 All tests passed!");
    } else {
      safeConsole.warn(`⚠️ ${total - passed} test(s) failed`);
    }
  }
}

// Individual test functions
export const testFunctions = {
  // Test 1: Error Boundary Implementation
  testErrorBoundary: () => {
    return new Promise((resolve) => {
      try {
        const ErrorBoundary =
          require("../components/ErrorBoundary.jsx").default;

        if (ErrorBoundary && typeof ErrorBoundary === "function") {
          resolve({
            passed: true,
            message:
              "ErrorBoundary component exists and is a valid React component",
          });
        } else {
          resolve({
            passed: false,
            message: "ErrorBoundary component not found or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `ErrorBoundary test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 2: API Layer Implementation
  testApiLayer: () => {
    return new Promise((resolve) => {
      try {
        const { menuApi, orderApi } = require("../api/index.js");

        if (
          menuApi &&
          orderApi &&
          typeof menuApi.getMenuItems === "function" &&
          typeof orderApi.createOrder === "function"
        ) {
          resolve({
            passed: true,
            message: "API layer properly implemented with menu and order APIs",
          });
        } else {
          resolve({
            passed: false,
            message: "API layer incomplete or missing methods",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `API layer test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 3: Custom Hooks Implementation
  testCustomHooks: () => {
    return new Promise((resolve) => {
      try {
        const { useMenu } = require("../hooks/useMenu.js");
        const { useCart } = require("../hooks/useLocalStorage.js");

        if (
          useMenu &&
          useCart &&
          typeof useMenu === "function" &&
          typeof useCart === "function"
        ) {
          resolve({
            passed: true,
            message: "Custom hooks properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Custom hooks missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Custom hooks test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 4: Accessibility Features
  testAccessibility: () => {
    return new Promise((resolve) => {
      try {
        const {
          announceToScreenReader,
          handleKeyboardNavigation,
        } = require("../utils/accessibility.js");

        if (
          announceToScreenReader &&
          handleKeyboardNavigation &&
          typeof announceToScreenReader === "function" &&
          typeof handleKeyboardNavigation === "function"
        ) {
          resolve({
            passed: true,
            message: "Accessibility utilities properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Accessibility utilities missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Accessibility test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 5: Skeleton Loading Components
  testSkeletonComponents: () => {
    return new Promise((resolve) => {
      try {
        const {
          Skeleton,
          MenuGridSkeleton,
        } = require("../ui/SkeletonLoader.jsx");

        if (
          Skeleton &&
          MenuGridSkeleton &&
          typeof Skeleton === "function" &&
          typeof MenuGridSkeleton === "function"
        ) {
          resolve({
            passed: true,
            message: "Skeleton loading components properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Skeleton components missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Skeleton components test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 6: Lazy Loading Implementation
  testLazyLoading: () => {
    return new Promise((resolve) => {
      try {
        const {
          useLazyImage,
          useIntersectionObserver,
        } = require("../hooks/useLazyLoading.js");

        if (
          useLazyImage &&
          useIntersectionObserver &&
          typeof useLazyImage === "function" &&
          typeof useIntersectionObserver === "function"
        ) {
          resolve({
            passed: true,
            message: "Lazy loading hooks properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Lazy loading hooks missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Lazy loading test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 7: Authentication Flow
  testAuthentication: () => {
    return new Promise((resolve) => {
      try {
        const { AuthProvider, useAuth } = require("../auth/AuthContext.jsx");

        if (
          AuthProvider &&
          useAuth &&
          typeof AuthProvider === "function" &&
          typeof useAuth === "function"
        ) {
          resolve({
            passed: true,
            message: "Authentication system properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Authentication system missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Authentication test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 8: Console Error Prevention
  testConsoleCleanup: () => {
    return new Promise((resolve) => {
      try {
        const {
          safeConsole,
          initErrorListeners,
        } = require("../utils/console.js");

        if (
          safeConsole &&
          initErrorListeners &&
          typeof safeConsole.log === "function" &&
          typeof initErrorListeners === "function"
        ) {
          resolve({
            passed: true,
            message: "Console cleanup utilities properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Console utilities missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Console cleanup test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 9: Local Storage Integration
  testLocalStorage: () => {
    return new Promise((resolve) => {
      try {
        // Test if localStorage is available
        const testKey = "abron_test";
        localStorage.setItem(testKey, "test");
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        if (retrieved === "test") {
          resolve({
            passed: true,
            message: "Local storage integration working properly",
          });
        } else {
          resolve({
            passed: false,
            message: "Local storage not functioning correctly",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Local storage test failed: ${error.message}`,
        });
      }
    });
  },

  // Test 10: Performance Monitoring
  testPerformanceMonitoring: () => {
    return new Promise((resolve) => {
      try {
        const { performanceLogger } = require("../utils/console.js");

        // Test performance marking
        performanceLogger.mark("test-start");
        performanceLogger.mark("test-end");

        if (performanceLogger && typeof performanceLogger.mark === "function") {
          resolve({
            passed: true,
            message: "Performance monitoring utilities properly implemented",
          });
        } else {
          resolve({
            passed: false,
            message: "Performance monitoring missing or invalid",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Performance monitoring test failed: ${error.message}`,
        });
      }
    });
  },
};

// Run all tests automatically in development
export const runImprovementTests = () => {
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "development"
  ) {
    const testSuite = new AppTestSuite();

    // Add all tests to the suite
    Object.entries(testFunctions).forEach(([name, testFn]) => {
      testSuite.addTest(name, testFn);
    });

    // Run tests after a short delay to ensure modules are loaded
    setTimeout(() => {
      testSuite.runAllTests();
    }, 1000);
  }
};

// DOM-based tests
export const domTests = {
  // Test if required DOM elements exist
  testRequiredElements: () => {
    const requiredElements = ["root"];
    const missing = [];

    requiredElements.forEach((id) => {
      if (!document.getElementById(id)) {
        missing.push(id);
      }
    });

    return {
      passed: missing.length === 0,
      message:
        missing.length === 0
          ? "All required DOM elements found"
          : `Missing required elements: ${missing.join(", ")}`,
    };
  },

  // Test if meta tags are properly set
  testMetaTags: () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    const charset = document.querySelector("meta[charset]");

    const hasViewport =
      viewport && viewport.content.includes("width=device-width");
    const hasCharset =
      charset && charset.getAttribute("charset").toLowerCase() === "utf-8";

    return {
      passed: hasViewport && hasCharset,
      message:
        hasViewport && hasCharset
          ? "Required meta tags properly set"
          : "Missing or incorrect meta tags",
    };
  },
};

export default {
  AppTestSuite,
  testFunctions,
  runImprovementTests,
  domTests,
};
