/**
 * Search Page Functionality
 */

class SearchPage extends AfroFlicks {
  constructor() {
    super();
    this.searchQuery = this.getSearchQueryFromUrl();
    this.currentPage = 1;
    this.filters = {
      year: '',
      rating: '',
      sortBy: 'popularity.desc'
    };
    this.setupFilterListeners();
    this.loadSearchResults();
  }

  /**
   * Get search query from URL
   */
  getSearchQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  /**
   * Setup filter event listeners
   */
  setupFilterListeners() {
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.filters.year = document.getElementById('filter-year').value;
        this.filters.rating = document.getElementById('filter-rating').value;
        this.filters.sortBy = document.getElementById('sort-by').value;
        this.currentPage = 1;
        this.loadSearchResults();
      });
    }
  }

  /**
   * Load search results
   */
  async loadSearchResults() {
    try {
      this.showLoadingState();
      const container = document.getElementById('search-results-container');
      if (!container) return;

      if (!this.searchQuery) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-xl);">Enter a search term to find movies</p>';
        return;
      }

      const params = {
        query: this.searchQuery,
        page: this.currentPage,
        language: 'en-US'
      };

      if (this.filters.year) {
        params['primary_release_year'] = this.filters.year;
      }

      if (this.filters.rating) {
        params['vote_average.gte'] = this.filters.rating;
      }

      params['sort_by'] = this.filters.sortBy;

      const data = await this.fetchFromTMDB('/search/movie', params);

      if (data.results.length === 0 && this.currentPage === 1) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-xl);">No movies found for "${this.escapeHtml(this.searchQuery)}"</p>`;
        return;
      }

      if (this.currentPage === 1) {
        container.innerHTML = '';
      }

      const moviesGrid = document.createElement('div');
      moviesGrid.className = 'movies-grid';
      moviesGrid.innerHTML = data.results
        .map(movie => this.createMovieCard(movie))
        .join('');

      container.appendChild(moviesGrid);

      // Update title
      this.setDynamicMetaTags(
        `Search: ${this.searchQuery} - AfroFlicks`,
        `Search results for "${this.searchQuery}" on AfroFlicks`
      );

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      this.hideLoadingState();
    }
  }

  /**
   * Override infinite scroll for search results
   */
  async loadMoreContent() {
    if (window.location.pathname === '/search.html') {
      this.currentPage++;
      await this.loadSearchResults();
    }
  }
}

// Initialize search page
document.addEventListener('DOMContentLoaded', () => {
  new SearchPage();
});
