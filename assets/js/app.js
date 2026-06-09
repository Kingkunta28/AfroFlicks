/**
 * AfroFlicks - Main Application Module
 * Core functionality for movie discovery platform
 */

class AfroFlicks {
  constructor() {
    this.cache = new Map();
    this.currentPage = 1;
    this.isLoading = false;
    this.favorites = this.loadFavorites();
    this.watchLater = this.loadWatchLater();
    this.debounceTimer = null;
    this.abortController = null;
    this.init();
  }

  /**
   * Initialize application
   */
  init() {
    this.setupEventListeners();
    this.setupServiceWorker();
    this.setDynamicMetaTags();
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }

    // Favorite button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-favorite')) {
        e.stopPropagation();
        this.toggleFavorite(e.target);
      }
      if (e.target.classList.contains('btn-watch-later')) {
        e.stopPropagation();
        this.toggleWatchLater(e.target);
      }
    });

    // Infinite scroll
    window.addEventListener('scroll', () => this.handleInfiniteScroll());
  }

  /**
   * Setup Service Worker for PWA support
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .catch(err => console.log('Service Worker registration failed:', err));
    }
  }

  /**
   * Fetch data from TMDB API
   */
  async fetchFromTMDB(endpoint, params = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(params)}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      this.abortController = new AbortController();
      const timeout = setTimeout(() => this.abortController.abort(), CONFIG.API_TIMEOUT);

      const url = new URL(`${CONFIG.TMDB_BASE_URL}${endpoint}`);
      url.searchParams.append('api_key', CONFIG.TMDB_API_KEY);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        signal: this.abortController.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, data);
      setTimeout(() => this.cache.delete(cacheKey), CONFIG.CACHE_DURATION);

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Handle search with debounce
   */
  handleSearch(event) {
    clearTimeout(this.debounceTimer);
    const query = event.target.value.trim();

    if (query.length < 2) {
      this.clearSearchResults();
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, CONFIG.DEBOUNCE_DELAY);
  }

  /**
   * Perform movie search
   */
  async performSearch(query) {
    try {
      this.showLoadingState();
      const data = await this.fetchFromTMDB('/search/movie', {
        query: query,
        page: 1,
        language: 'en-US'
      });

      this.displaySearchResults(data.results);
    } catch (error) {
      this.showError('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      this.hideLoadingState();
    }
  }

  /**
   * Display search results
   */
  displaySearchResults(movies) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (movies.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No movies found</p>';
      return;
    }

    resultsContainer.innerHTML = movies
      .map(movie => this.createMovieCard(movie))
      .join('');
  }

  /**
   * Create movie card HTML
   */
  createMovieCard(movie) {
    // Use CORS proxy for images
    let posterUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3C/svg%3E';
    
    if (movie.poster_path) {
      posterUrl = `https://images.weserv.nl/?url=image.tmdb.org/t/p/w342${movie.poster_path}`;
    }

    const isFavorite = this.favorites.has(movie.id);
    const isWatchLater = this.watchLater.has(movie.id);

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    return `
      <div class="movie-card" data-movie-id="${movie.id}">
        <div class="card-image">
          <img 
            src="${posterUrl}" 
            alt="${this.escapeHtml(movie.title)}"
            class="movie-poster"
            style="background-color: #333; display: block;"
          />
          <div class="card-overlay">
            <div class="card-actions">
              <button 
                class="btn-favorite ${isFavorite ? 'active' : ''}"
                data-movie-id="${movie.id}"
                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              <button 
                class="btn-watch-later ${isWatchLater ? 'active' : ''}"
                data-movie-id="${movie.id}"
                title="${isWatchLater ? 'Remove from watch later' : 'Add to watch later'}"
                aria-label="${isWatchLater ? 'Remove from watch later' : 'Add to watch later'}"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </button>
              <a href="movie.html?id=${movie.id}" class="btn-play" aria-label="View movie details">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </a>
            </div>
            <div class="card-info">
              <h3 class="card-title">${this.escapeHtml(movie.title)}</h3>
              <p class="card-year">${releaseYear}</p>
            </div>
          </div>
        </div>
        <div class="card-rating">
          <div class="rating-badge">
            <span class="rating-value">${rating}</span>
            <span class="rating-label">IMDb</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create skeleton loader for movie cards
   */
  createMovieCardSkeleton() {
    return `
      <div class="movie-card skeleton">
        <div class="card-image skeleton-poster"></div>
        <div class="card-rating">
          <div class="rating-badge skeleton-rating"></div>
        </div>
      </div>
    `;
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(button) {
    const movieId = parseInt(button.dataset.movieId);
    
    if (this.favorites.has(movieId)) {
      this.favorites.delete(movieId);
      button.classList.remove('active');
      button.setAttribute('aria-label', 'Add to favorites');
    } else {
      this.favorites.add(movieId);
      button.classList.add('active');
      button.setAttribute('aria-label', 'Remove from favorites');
    }

    this.saveFavorites();
    this.showNotification('Favorite updated');
  }

  /**
   * Toggle watch later status
   */
  toggleWatchLater(button) {
    const movieId = parseInt(button.dataset.movieId);
    
    if (this.watchLater.has(movieId)) {
      this.watchLater.delete(movieId);
      button.classList.remove('active');
      button.setAttribute('aria-label', 'Add to watch later');
    } else {
      this.watchLater.add(movieId);
      button.classList.add('active');
      button.setAttribute('aria-label', 'Remove from watch later');
    }

    this.saveWatchLater();
    this.showNotification('Watch later updated');
  }

  /**
   * Load favorites from localStorage
   */
  loadFavorites() {
    const data = localStorage.getItem('afroflicks_favorites');
    return data ? new Set(JSON.parse(data)) : new Set();
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites() {
    localStorage.setItem('afroflicks_favorites', JSON.stringify(Array.from(this.favorites)));
  }

  /**
   * Load watch later list from localStorage
   */
  loadWatchLater() {
    const data = localStorage.getItem('afroflicks_watchlater');
    return data ? new Set(JSON.parse(data)) : new Set();
  }

  /**
   * Save watch later list to localStorage
   */
  saveWatchLater() {
    localStorage.setItem('afroflicks_watchlater', JSON.stringify(Array.from(this.watchLater)));
  }

  /**
   * Handle infinite scroll
   */
  async handleInfiniteScroll() {
    const sentinel = document.getElementById('infinite-scroll-sentinel');
    if (!sentinel || this.isLoading) return;

    const rect = sentinel.getBoundingClientRect();
    if (rect.top < window.innerHeight * CONFIG.INFINITE_SCROLL_THRESHOLD) {
      await this.loadMoreContent();
    }
  }

  /**
   * Load more content (to be implemented per page)
   */
  async loadMoreContent() {
    // Override in specific pages
  }

  /**
   * Show loading state with skeletons
   */
  showLoadingState() {
    const container = document.getElementById('content-container') 
      || document.getElementById('movie-grid')
      || document.querySelector('.movies-grid');
    
    if (container && !this.isLoading) {
      this.isLoading = true;
      const skeletons = Array(12)
        .fill(0)
        .map(() => this.createMovieCardSkeleton())
        .join('');
      container.innerHTML = skeletons;
    }
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    this.isLoading = false;
  }

  /**
   * Show error message
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-banner';
    errorDiv.innerHTML = `
      <div class="error-content">
        <p>${this.escapeHtml(message)}</p>
        <button onclick="this.parentElement.parentElement.remove()" aria-label="Close error">×</button>
      </div>
    `;
    document.body.insertBefore(errorDiv, document.body.firstChild);

    setTimeout(() => errorDiv.remove(), 5000);
  }

  /**
   * Show notification message
   */
  showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Clear search results
   */
  clearSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  /**
   * Set dynamic meta tags for SEO
   */
  setDynamicMetaTags(title = 'AfroFlicks - Africa\'s Movies, One Click Away', 
                     description = 'Discover African movies and stream your favorites. Premium movie discovery platform with ratings, trailers, and streaming providers.',
                     image = window.location.origin + '/assets/images/og-image.png') {
    
    // Update title
    document.title = title;
    
    // Update/create meta tags
    this.updateMetaTag('og:title', title);
    this.updateMetaTag('og:description', description);
    this.updateMetaTag('og:image', image);
    this.updateMetaTag('twitter:title', title);
    this.updateMetaTag('twitter:description', description);
    this.updateMetaTag('twitter:image', image);
    this.updateMetaTag('description', description);
  }

  /**
   * Update or create meta tag
   */
  updateMetaTag(name, content) {
    let tag = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(name.includes('og:') ? 'property' : 'name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  /**
   * Lazy load images
   */
  lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Format date string
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format currency
   */
  formatCurrency(value) {
    if (!value || value === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input) {
    return input.replace(/[<>\"']/g, (char) => {
      const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
      return escapeMap[char];
    });
  }
}

// Initialize app when DOM is ready
//let app;
//document.addEventListener('DOMContentLoaded', () => {
  //app = new AfroFlicks();
//});
