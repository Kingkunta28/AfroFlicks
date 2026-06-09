// Configuration Template
// Copy this file to config.js and add your TMDB API Bearer Token

const CONFIG = {
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  TMDB_IMAGE_SIZES: {
    poster: 'w342',
    backdrop: 'w1280',
    profile: 'w185',
    logo: 'w200'
  },
  AFFILIATE_LINKS: {
    nordvpn: 'https://your-affiliate-link.com',
    showmax: 'https://your-showmax-link.com',
    prime_video: 'https://your-prime-link.com'
  },
  API_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 500,
  INFINITE_SCROLL_THRESHOLD: 0.5,
  PAGE_SIZE: 20,
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
  DEFAULT_LANGUAGE: 'en-US',
  SUPPORTED_LANGUAGES: ['en', 'fr', 'es', 'de', 'pt']
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
