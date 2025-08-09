/**
 * Razorpay Debug Utility
 * Helps diagnose common Razorpay integration issues
 */

export const razorpayDebugger = {
    // Check if Razorpay is loaded
    checkSDK: () => {
        console.log("🔍 Checking Razorpay SDK...");

        if (typeof window === 'undefined') {
            console.log("❌ Window object not available (SSR)");
            return false;
        }

        if (window.Razorpay) {
            console.log("✅ Razorpay SDK is loaded");
            return true;
        } else {
            console.log("❌ Razorpay SDK not loaded");
            return false;
        }
    },

    // Check for ad blocker interference
    checkAdBlocker: () => {
        console.log("🔍 Checking for ad blocker interference...");

        // Common ad blocker indicators
        const adBlockerIndicators = [
            'adblocker detected',
            'adblock',
            'ublock',
            'ghostery'
        ];

        const userAgent = navigator.userAgent.toLowerCase();
        const hasAdBlockerSignals = adBlockerIndicators.some(indicator =>
            userAgent.includes(indicator)
        );

        if (hasAdBlockerSignals) {
            console.log("⚠️ Possible ad blocker detected in user agent");
        }

        // Check if external scripts are being blocked
        const testScript = document.createElement('script');
        testScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
        testScript.onload = () => console.log("✅ External script loading is working");
        testScript.onerror = () => console.log("❌ External script blocked (likely ad blocker)");

        // Don't actually add to DOM to avoid duplicate loading
        // Just test the creation

        return !hasAdBlockerSignals;
    },

    // Check environment configuration
    checkConfig: () => {
        console.log("🔍 Checking Razorpay configuration...");

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        if (!keyId) {
            console.log("⚠️ NEXT_PUBLIC_RAZORPAY_KEY_ID not set in environment variables");
            console.log("Using fallback key");
        } else if (keyId.startsWith('rzp_test_')) {
            console.log("🧪 Using TEST mode Razorpay key");
        } else if (keyId.startsWith('rzp_live_')) {
            console.log("🔴 Using LIVE mode Razorpay key");
        } else {
            console.log("❌ Invalid Razorpay key format");
            return false;
        }

        return true;
    },

    // Check browser compatibility
    checkBrowser: () => {
        console.log("🔍 Checking browser compatibility...");

        const userAgent = navigator.userAgent;
        console.log("Browser:", userAgent);

        // Check for known problematic browsers/modes
        if (userAgent.includes('Instagram')) {
            console.log("⚠️ Instagram in-app browser detected - may have payment restrictions");
        }

        if (userAgent.includes('FBAN') || userAgent.includes('FBAV')) {
            console.log("⚠️ Facebook in-app browser detected - may have payment restrictions");
        }

        if (userAgent.includes('WhatsApp')) {
            console.log("⚠️ WhatsApp in-app browser detected - may have payment restrictions");
        }

        // Check for required features
        const hasRequiredFeatures = !!(
            window.fetch &&
            window.Promise &&
            window.addEventListener
        );

        if (hasRequiredFeatures) {
            console.log("✅ Browser supports required features");
        } else {
            console.log("❌ Browser missing required features");
        }

        return hasRequiredFeatures;
    },

    // Run all checks
    runAllChecks: () => {
        console.log("🔍 Running Razorpay diagnostic checks...");
        console.log("=====================================");

        const results = {
            sdk: razorpayDebugger.checkSDK(),
            adBlocker: razorpayDebugger.checkAdBlocker(),
            config: razorpayDebugger.checkConfig(),
            browser: razorpayDebugger.checkBrowser()
        };

        console.log("=====================================");
        console.log("📊 Diagnostic Results:");
        console.log("SDK Loaded:", results.sdk ? "✅" : "❌");
        console.log("Ad Blocker Check:", results.adBlocker ? "✅" : "⚠️");
        console.log("Config Valid:", results.config ? "✅" : "❌");
        console.log("Browser Compatible:", results.browser ? "✅" : "❌");

        if (!results.sdk) {
            console.log("\n💡 Troubleshooting Tips:");
            console.log("1. Disable ad blocker and refresh page");
            console.log("2. Try incognito/private browsing mode");
            console.log("3. Check network connectivity");
            console.log("4. Verify Razorpay script URL is accessible");
        }

        return results;
    }
};

// Auto-run checks in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Wait a bit for everything to load
    setTimeout(() => {
        razorpayDebugger.runAllChecks();
    }, 3000);
}
