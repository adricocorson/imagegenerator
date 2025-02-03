// Configuration for the application
const config = {
    API_ENDPOINT: "https://api.hyperbolic.xyz/v1/image/generation",
    MODEL: "SDXL1.0-base",
    DEFAULT_PARAMS: {
        steps: 30,
        cfg_scale: 5,
        width: 1024,
        height: 1024,
        enable_refiner: false,
        backend: "auto"
    }
};

// Get API key from environment variable or Netlify
config.API_KEY = window.ENV_VARS?.HYPERBOLIC_API_KEY || '';

export default config;
