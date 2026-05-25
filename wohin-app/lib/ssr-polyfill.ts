// Polyfill for Reanimated/NativeWind on the server (SSR) to avoid "cancelAnimationFrame is not defined"
// This ensures that even if something is imported before this script, we try to catch it.
(function() {
  if (typeof window === 'undefined') {
    const timeoutShim = (callback: any) => setTimeout(callback, 0);
    const clearShim = (id: any) => clearTimeout(id);

    // Unconditionally set them to ensure they exist during SSR
    (global as any).requestAnimationFrame = timeoutShim;
    (global as any).cancelAnimationFrame = clearShim;
    (global as any).setImmediate = timeoutShim;
    
    (globalThis as any).requestAnimationFrame = timeoutShim;
    (globalThis as any).cancelAnimationFrame = clearShim;
    (globalThis as any).setImmediate = timeoutShim;
  }
})();
