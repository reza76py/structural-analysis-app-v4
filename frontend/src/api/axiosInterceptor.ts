import axios from "axios";

// Define the runtime base URL you want to replace with
const PROD_BASE_URL = "https://api.spacetruss.rezteche.com";

// Activate ONLY in production
if (import.meta.env.PROD) {
  axios.interceptors.request.use((config) => {
    if (typeof config.url === "string" && config.url.startsWith("http://127.0.0.1:8000")) {
      config.url = config.url.replace("http://127.0.0.1:8000", PROD_BASE_URL);
    }
    return config;
  });
}
