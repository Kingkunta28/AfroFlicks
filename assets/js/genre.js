/**
 * Genre Page Functionality
 */

class GenrePage extends AfroFlicks {
  constructor() {
    super();
    this.genreId = this.getGenreIdFromUrl();
    this.genreName = this.getGenreNameFromUrl();
    this.currentPage = 1;
    this.sortBy = 'popularity.desc';
    this.setupSortListener();
    if (this.genreId) {
      this.loadGenreMovies();
    } else {
      window.location.href = '/404.html';
    }
  }

  /**
   * Get genre ID from URL
   */
  getGenreIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  /**
   * Get genre name from URL
   */
  getGenreNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('name') || 'Genre';
  }

  /**
   * Setup sort listener
   */
  setupSortListener() {
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
      sortBy.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.currentPage = 1;
        this.loadGenreMovies();
      });
    }
  }

  /**
   * Load movies by genre
   */
  async loadGenreMovies() {
    try {
      this.showLoadingState();
      const container = document.getElementById('genre-movies');
      if (!container) return;

      // Update title
      const titleElement = document.getElementById('genre-title');
      if (titleElement) {
        titleElement.textContent = this.genreName;
      }

      const data = await this.fetchFromTMDB('/discover/movie', {
        with_genres: this.genreId,
        sort_by: this.sortBy,
        page: this.currentPage,
        language: 'en-US'
      });

      if (this.currentPage === 1) {
        container.innerHTML = '';
      }

      if (data.results.length === 0 && this.currentPage === 1) {
        container.innerHTML = '<p>No movies found in this genre</p>';
        return;
      }

      const html = data.results
        .map(movie => this.createMovieCard(movie))
        .join('');

      container.innerHTML += html;

      // Update meta tags
      this.setDynamicMetaTags(
        `${this.genreName} Movies - AfroFlicks`,
        `Discover ${this.genreName} movies on AfroFlicks`
      );

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load genre movies');
      console.error('Genre movies error:', error);
    } finally {
      this.hideLoadingState();
    }
  }

  /**
   * Override infinite scroll for genre page
   */
  async loadMoreContent() {
    if (window.location.pathname === '/genre.html') {
      this.currentPage++;
      await this.loadGenreMovies();
    }
  }
}

// Initialize genre page
document.addEventListener('DOMContentLoaded', () => {
  new GenrePage();
});
