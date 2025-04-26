/**
 * Configuration loader for the Address Collection Widget
 * Loads environment variables from .env file or provides fallbacks for deployment
 */

// Configuration object to store environment variables
window.config = {};

// Function to load configuration from .env file
window.loadConfig = async function() {
    try {
        // Check if we're on Vercel (production) with env.js loaded
        if (window.ENV && window.ENV.WEBHOOK_URL) {
            console.log('Using environment variables from env.js');
            return {
                googleMapsApiKey: '',
                webhookUrl: window.ENV.WEBHOOK_URL
            };
        }
        
        // Try to fetch the .env file (for local development)
        const response = await fetch('.env');
        
        // If the fetch fails, use fallback values
        if (!response.ok) {
            console.warn('Could not load .env file, using fallback values');
            return {
                googleMapsApiKey: '',
                webhookUrl: '' // Empty webhook URL - will be handled gracefully in widget.js
            };
        }
        
        // Parse the .env file
        const envText = await response.text();
        const envVars = parseEnv(envText);
        
        // Store in the config object
        window.config = envVars;
        
        return envVars;
    } catch (error) {
        console.error('Error loading configuration:', error);
        
        // Return fallback values
        return {
            googleMapsApiKey: '',
            webhookUrl: '' // Empty webhook URL - will be handled gracefully in widget.js
        };
    }
};

// Helper function to parse .env file
function parseEnv(envText) {
    const result = {
        googleMapsApiKey: '',
        webhookUrl: ''
    };
    
    // Split by lines and process each line
    const lines = envText.split('\n');
    
    for (const line of lines) {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) {
            continue;
        }
        
        // Split by first equals sign
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
            const key = line.substring(0, equalIndex).trim();
            const value = line.substring(equalIndex + 1).trim();
            
            // Map environment variables to config properties
            if (key === 'GOOGLE_MAPS_API_KEY') {
                result.googleMapsApiKey = value;
            } else if (key === 'WEBHOOK_URL') {
                result.webhookUrl = value;
            }
        }
    }
    
    return result;
}
