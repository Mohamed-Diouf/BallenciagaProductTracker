  /**
   * BALENCIAGA PRODUCT TRACKER
   * 
   * Author: Mohamed Diouf
   * Date: January 2026
   */

  (function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    // CSS selectors to find product elements on the page
    // trying to multiple the selectors because the exact structure might vary
    const PRODUCT_SELECTOR = 'article'; 
    
    // Products we've already logged (to avoid duplicates)
    // Using an object as a simple hash map: { "product-id": true }
    const seenProducts = {};

    // Flag to avoid checking too frequently while scrolling
    let isChecking = false;

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================

    /**
     * Check if an element is visible in the browser viewport
     * An element is considered visible if at least 50% of it is shown
     * 
     * @param {HTMLElement} element - The DOM element to check
     * @returns {boolean} - True if element is at least 50% visible
     */
    function isVisible(element) {
      // Get element position and size relative to viewport
      const rect = element.getBoundingClientRect();
      
      // Get viewport dimensions
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Check if element is not completely outside the viewport and has height
      if (!(rect.bottom < 0 || rect.top > viewportHeight) && rect.height > 0) {
        return true;
      }
      
      // Calculate how much of the element is visible
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = visibleBottom - visibleTop;
      
      // Calculate percentage of element that's visible
      const visibilityPercentage = visibleHeight / rect.height;
      
      // Return true if at least 50% is visible
      return visibilityPercentage >= 0.5;
    }

    /**
     * Extract product name from a product element
     * Tries multiple common selectors for product names
     * 
     * @param {HTMLElement} productElement - The product card element
     * @returns {string|null} - Product name or null if not found
     */
    function getProductName(productElement) {
      // List of selectors to try, in order of preference
      const selectors = ['h2', 'h3', '.product-name', '[class*="name"]'];
      
      // Try each selector until we find one that works
      for (let i = 0; i < selectors.length; i++) {
        const element = productElement.querySelector(selectors[i]);
        if (element && element.textContent.trim()) {
          return element.textContent.trim();
        }
      }
      
      return null;
    }

    /**
     * Extract product price from a product element
     * Tries multiple common selectors for prices
     * 
     * @param {HTMLElement} productElement - The product card element
     * @returns {string|null} - Product price or null if not found
     */
    function getProductPrice(productElement) {
      // List of selectors to try, in order of preference
      const selectors = ['.price', '[class*="price"]', '[class*="Price"]'];
      
      // Try each selector until we find one that works
      for (let i = 0; i < selectors.length; i++) {
        const element = productElement.querySelector(selectors[i]);
        if (element && element.textContent.trim()) {
          return element.textContent.trim();
        }
      }
      
      return null;
    }

    /**
     * Create a unique ID for a product based on name, price, and position
     * This helps us track which products we've already seen
     * 
     * @param {string} name - Product name
     * @param {string} price - Product price
     * @param {number} position - Product position index
     * @returns {string} - Unique identifier (lowercase for consistency)
     */
    function createProductId(name, price, position) {
      return (name + '|' + price + '|' + position).toLowerCase();
    }

    /**
     * Check if a product has already been logged
     * 
     * @param {string} productId - The unique product identifier
     * @returns {boolean} - True if already seen
     */
    function hasBeenSeen(productId) {
      return seenProducts[productId] === true;
    }

    /**
     * Mark a product as seen so we don't log it again
     * 
     * @param {string} productId - The unique product identifier
     */
    function markAsSeen(productId) {
      seenProducts[productId] = true;
    }

    // ============================================================================
    // MAIN LOGIC
    // ============================================================================

    /**
     * Check all products on the page and log visible ones
     * This function is called when the page loads and when user scrolls
     */
    function checkVisibleProducts() {
      // Find all product elements on the page
      const products = document.querySelectorAll(PRODUCT_SELECTOR);
      
      // If no products found, show warning
      if (products.length === 0) {
        console.warn('No products found. The selector might need adjustment.');
        return;
      }
      
      // Check each product
      products.forEach(function(product, index ) {
        // Only process if product is visible
        if (isVisible(product)) {
          // Extract product information
          const name = getProductName(product);
          const price = getProductPrice(product);
        
          // Make sure we found both name and price
          if (name && price ) {
        
            // Create unique ID
            const productId = createProductId(name, price, index);
            
            // Only log if we haven't seen this product before
            if (!hasBeenSeen(productId)) {
              // Log product to console
              console.log(' Product:' + name + ' Price: ' + price );
              
              // Mark as seen to avoid duplicate logs
              markAsSeen(productId);
            }
          }
        }
      });
      
      // Reset the checking flag
      isChecking = false;
    }

    /**
     * Handle scroll events
     * Uses a simple flag to avoid checking too frequently
     */
    function handleScroll() {
      // If already checking, skip this scroll event
      if (isChecking) {
        return;
      }
      
      // Set flag to prevent multiple simultaneous checks
      isChecking = true;
      
      // Wait a short moment before checking (improves performance)
      setTimeout(checkVisibleProducts, 100);
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    /**
     * Initialize the tracker when page is ready
     */
    function init() {
      console.log(' Product Tracker initialized');
      
      // Check visible products immediately on page load
      checkVisibleProducts();
      
      // Listen for scroll events
      window.addEventListener('scroll', handleScroll);
      
      // Also check when window is resized
      window.addEventListener('resize', handleScroll);
      
      console.log('Tracker is ready! Scroll to see products logged.');
    }

    // Wait for page to be ready, then initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // Page already loaded, initialize immediately
      init();
    }

  })();
