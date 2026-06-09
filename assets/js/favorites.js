/**
 * Favorites Page Functionality
 */

class FavoritesPage extends AfroFlicks {
  constructor() {
    super();
    this.loadFavoritesPage();
  }

  /**
   * Load favorites page
   */
  async loadFavoritesPage() {
    try {
      const grid = document.getElementById('favorites-grid');
      const emptyState = document.getElementById('empty-favorites');

      if (this.favorites.size === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }

      this.showLoadingState();

      const movieIds = Array.from(this.favorites);
      const movies = [];

      // Fetch details for each favorite
      for (const movieId of movieIds.slice(0, 60)) { // Limit to prevent too many API calls
        try {
          const movie = await this.fetchFromTMDB(`/movie/${movieId}`, {
            language: 'en-US'
          });
          movies.push(movie);
        } catch (error) {
          console.error(`Failed to load movie ${movieId}:`, error);
        }
      }

      if (movies.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }

      grid.innerHTML = movies
        .map(movie => this.createMovieCard(movie))
        .join('');

      emptyState.style.display = 'none';
      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load favorites');
      console.error('Favorites load error:', error);
    } finally {
      this.hideLoadingState();
    }
  }
}

// Initialize favorites page
document.addEventListener('DOMContentLoaded', () => {
  new FavoritesPage();
});
