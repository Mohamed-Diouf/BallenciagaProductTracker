# BallenciagaProductTracker

  HOW TO USE:
 * 1. Open https://www.balenciaga.com/en-us/women/shoes/sneakers
 * 2. Open browser console (F12 or Right-click > Inspect > Console)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 5. Scroll the page to see products logged
  
  HOW IT WORKS:
 * - When you scroll, the script checks which products are visible
 * - For each visible product, it extracts the name and price
 * - It creates a unique ID (name + price) to track duplicates
 * - If the product hasn't been logged before, it logs it to console
 * - The product is marked as "seen" to prevent duplicate logs
  
  BROWSER COMPATIBILITY:
 * - Works in all modern browsers (Chrome, Firefox, Safari, Edge)
 * - Also works in older browsers (IE11+)
  
  POSSIBLE IMPROVEMENTS:
 * - Could use Intersection Observer API for better performance (modern browsers only)
 * - Could add throttling/debouncing for more precise scroll handling
 * - Could handle dynamically loaded products (infinite scroll) with MutationObserver
