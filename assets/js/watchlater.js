/**
 * Watch Later Page Functionality
 */

class WatchLaterPage extends AfroFlicks {
  constructor() {
    super();
    this.loadWatchLaterPage();
  }

  /**
   * Load watch later page
   */
  async loadWatchLaterPage() {
    try {
      const grid = document.getElementById('watchlater-grid');
      const emptyState = document.getElementById('empty-watchlater');

      if (this.watchLater.size === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }

      this.showLoadingState();

      const movieIds = Array.from(this.watchLater);
      const movies = [];

      // Fetch details for each movie in watch later
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
      this.showError('Failed to load watch later list');
      console.error('Watch later load error:', error);
    } finally {
      this.hideLoadingState();
    }
  }
}

// Initialize watch later page
document.addEventListener('DOMContentLoaded', () => {
  new WatchLaterPage();
});
