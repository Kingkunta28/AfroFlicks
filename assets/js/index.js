/**
 * Home Page Functionality
 */

class HomePage extends AfroFlicks {
  constructor() {
    super();
    this.trendingPage = 1;
    this.loadHomeContent();
  }

  /**
   * Load all home page content
   */
  async loadHomeContent() {
    try {
      await Promise.all([
        this.loadHeroMovie(),
        this.loadTrendingMovies(),
        this.loadPopularMovies(),
        this.loadTopRatedMovies(),
        this.loadUpcomingMovies(),
        this.loadGenres()
      ]);
    } catch (error) {
      this.showError('Failed to load content. Please refresh the page.');
      console.error('Home content load error:', error);
    }
  }

  /**
   * Load hero featured movie
   */
  async loadHeroMovie() {
    try {
      const data = await this.fetchFromTMDB('/trending/movie/day', { language: 'en-US' });
      if (data.results.length > 0) {
        const movie = data.results[0];
        const backdrop = movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
          : 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)';
        
        const heroBackdrop = document.getElementById('hero-backdrop');
        if (heroBackdrop) {
          heroBackdrop.style.backgroundImage = `url('${backdrop}')`;
        }
      }
    } catch (error) {
      console.error('Hero movie load error:', error);
    }
  }

  /**
   * Load trending movies
   */
  async loadTrendingMovies() {
    try {
      this.showLoadingState();
      const container = document.getElementById('trending-movies');
      if (!container) return;

      const data = await this.fetchFromTMDB('/trending/movie/day', {
        page: this.trendingPage,
        language: 'en-US'
      });

      if (this.trendingPage === 1) {
        container.innerHTML = data.results
          .map(movie => this.createMovieCard(movie))
          .join('');
      } else {
        container.innerHTML += data.results
          .map(movie => this.createMovieCard(movie))
          .join('');
      }

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load trending movies');
      console.error('Trending movies error:', error);
    } finally {
      this.hideLoadingState();
    }
  }

  /**
   * Load popular movies
   */
  async loadPopularMovies() {
    try {
      const container = document.getElementById('popular-movies');
      if (!container) return;

      const data = await this.fetchFromTMDB('/movie/popular', {
        page: 1,
        language: 'en-US'
      });

      container.innerHTML = data.results
        .slice(0, 12)
        .map(movie => this.createMovieCard(movie))
        .join('');

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load popular movies');
      console.error('Popular movies error:', error);
    }
  }

  /**
   * Load top rated movies
   */
  async loadTopRatedMovies() {
    try {
      const container = document.getElementById('top-rated-movies');
      if (!container) return;

      const data = await this.fetchFromTMDB('/movie/top_rated', {
        page: 1,
        language: 'en-US'
      });

      container.innerHTML = data.results
        .slice(0, 12)
        .map(movie => this.createMovieCard(movie))
        .join('');

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load top rated movies');
      console.error('Top rated movies error:', error);
    }
  }

  /**
   * Load upcoming movies
   */
  async loadUpcomingMovies() {
    try {
      const container = document.getElementById('upcoming-movies');
      if (!container) return;

      const data = await this.fetchFromTMDB('/movie/upcoming', {
        page: 1,
        language: 'en-US'
      });

      container.innerHTML = data.results
        .slice(0, 12)
        .map(movie => this.createMovieCard(movie))
        .join('');

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load upcoming movies');
      console.error('Upcoming movies error:', error);
    }
  }

  /**
   * Load genres and create genre cards
   */
  async loadGenres() {
    try {
      const container = document.getElementById('genres-container');
      if (!container) return;

      const data = await this.fetchFromTMDB('/genre/movie/list', {
        language: 'en-US'
      });

      container.innerHTML = data.genres
        .slice(0, 12)
        .map(genre => `
          <a href="/genre.html?id=${genre.id}&name=${encodeURIComponent(genre.name)}" class="movie-card" style="text-decoration: none;">
            <div class="card-image" style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 199, 0, 0.6) 100%); display: flex; align-items: center; justify-content: center;">
              <div class="card-info" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <h3 class="card-title" style="font-size: 1.5rem;">${this.escapeHtml(genre.name)}</h3>
              </div>
            </div>
          </a>
        `)
        .join('');
    } catch (error) {
      this.showError('Failed to load genres');
      console.error('Genres error:', error);
    }
  }

  /**
   * Override infinite scroll for trending movies
   */
  async loadMoreContent() {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      this.trendingPage++;
      await this.loadTrendingMovies();
    }
  }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});
