// Load environment variables
const loadEnv = async () => {
  try {
    const response = await fetch('.env');
    const text = await response.text();
    
    // Parse .env file
    const envVars = {};
    text.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (line.startsWith('#') || !line.trim()) return;
      
      // Parse key-value pairs
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        envVars[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
};

// Expose config to global scope
window.loadConfig = async () => {
  const env = await loadEnv();
  return {
    googleMapsApiKey: env.GOOGLE_MAPS_API_KEY || '',
    webhookUrl: env.WEBHOOK_URL || ''
  };
};
