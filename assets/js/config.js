// Configuration
// Update TMDB_API_KEY with your actual API token from https://www.themoviedb.org/settings/api

const CONFIG = {
  TMDB_API_KEY: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjA4YzI4ZjJmZjc3MDYxNmQ2NTMwNzQ4YWNkYjIzNiIsInN1YiI6IjY1ZGE2NjNjNjQ5OTI1MDE2MzQ2OTY3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CwJkKa05i39MpRd0zxLEXrR_l6n03Vt-S4_1A8M_f4E',
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
    showmax: 'https://www.showmax.com',
    prime_video: 'https://www.amazon.com/Prime-Video/'
  },
  API_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 500,
  INFINITE_SCROLL_THRESHOLD: 0.5,
  PAGE_SIZE: 20,
  CACHE_DURATION: 3600000,
  DEFAULT_LANGUAGE: 'en-US',
  SUPPORTED_LANGUAGES: ['en', 'fr', 'es', 'de', 'pt']
};
