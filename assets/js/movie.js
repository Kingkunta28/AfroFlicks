/**
 * Movie Details Page Functionality
 */

class MoviePage extends AfroFlicks {
  constructor() {
    super();
    this.movieId = this.getMovieIdFromUrl();
    this.movieData = null;
    this.setupTabs();
    if (this.movieId) {
      this.loadMovieDetails();
    } else {
      window.location.href = '/404.html';
    }
  }

  /**
   * Get movie ID from URL params
   */
  getMovieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  /**
   * Setup tab functionality
   */
  setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
  }

  /**
   * Switch active tab
   */
  switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    // Show selected tab
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }
    event.target.classList.add('active');
    event.target.setAttribute('aria-selected', 'true');
  }

  /**
   * Load movie details
   */
  async loadMovieDetails() {
    try {
      this.showLoadingState();
      
      // Fetch movie data
      this.movieData = await this.fetchFromTMDB(`/movie/${this.movieId}`, {
        language: 'en-US',
        append_to_response: 'videos,credits,recommendations,watch/providers'
      });

      this.setDynamicMetaTags(
        this.movieData.title,
        this.movieData.overview,
        this.movieData.poster_path 
          ? `${CONFIG.TMDB_IMAGE_BASE_URL}/w500${this.movieData.poster_path}`
          : null
      );

      await Promise.all([
        this.displayMovieHeader(),
        this.displayOverview(),
        this.displayCast(),
        this.displayStreamingProviders(),
        this.displaySimilarMovies()
      ]);

      this.lazyLoadImages();
    } catch (error) {
      this.showError('Failed to load movie details');
      console.error('Movie details error:', error);
    } finally {
      this.hideLoadingState();
    }
  }

  /**
   * Display movie header with backdrop and poster
   */
  async displayMovieHeader() {
    if (!this.movieData) return;

    const backdropUrl = this.movieData.backdrop_path
      ? `${CONFIG.TMDB_IMAGE_BASE_URL}/w1280${this.movieData.backdrop_path}`
      : 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)';

    document.getElementById('movie-backdrop').style.backgroundImage = `url('${backdropUrl}')`;

    const posterUrl = this.movieData.poster_path
      ? `${CONFIG.TMDB_IMAGE_BASE_URL}/w342${this.movieData.poster_path}`
      : 'assets/images/placeholder.png';

    const releaseDate = this.movieData.release_date ? new Date(this.movieData.release_date).getFullYear() : 'N/A';
    const rating = this.movieData.vote_average ? this.movieData.vote_average.toFixed(1) : 'N/A';
    const genres = this.movieData.genres ? this.movieData.genres.map(g => g.name).join(', ') : 'N/A';

    const isFavorite = this.favorites.has(this.movieData.id);
    const isWatchLater = this.watchLater.has(this.movieData.id);

    const headerContent = document.getElementById('movie-header-content');
    headerContent.innerHTML = `
      <img 
        src="${posterUrl}" 
        alt="${this.escapeHtml(this.movieData.title)}"
        class="movie-poster-large"
        loading="lazy"
        onerror="this.src='assets/images/placeholder.png'"
      />
      <div class="movie-info-header">
        <h1>${this.escapeHtml(this.movieData.title)}</h1>
        ${this.movieData.tagline ? `<p style="color: var(--color-accent-gold); font-style: italic; margin-bottom: var(--spacing-lg);">"${this.escapeHtml(this.movieData.tagline)}"</p>` : ''}
        
        <div class="movie-meta">
          <div class="meta-item">
            <span class="meta-label">Release Date</span>
            <span class="meta-value">${this.formatDate(this.movieData.release_date)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Runtime</span>
            <span class="meta-value">${this.movieData.runtime ? this.movieData.runtime + ' min' : 'N/A'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Genres</span>
            <span class="meta-value">${genres}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Language</span>
            <span class="meta-value">${this.movieData.original_language.toUpperCase()}</span>
          </div>
        </div>

        <div class="movie-rating-large">
          <div class="rating-circle" title="IMDb Rating">${rating}</div>
          <div class="rating-circle-text">
            <span class="rating-label">Based on ${(this.movieData.vote_count || 0).toLocaleString()} votes</span>
          </div>
        </div>

        <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-lg);">
          <button class="btn btn-primary btn-favorite" data-movie-id="${this.movieData.id}" ${isFavorite ? 'aria-label="Remove from favorites"' : 'aria-label="Add to favorites"'}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <button class="btn btn-secondary btn-watch-later" data-movie-id="${this.movieData.id}" ${isWatchLater ? 'aria-label="Remove from watch later"' : 'aria-label="Add to watch later"'}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            ${isWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Display overview section
   */
  async displayOverview() {
    if (!this.movieData) return;

    const overviewContent = document.getElementById('overview-content');
    
    let trailerHtml = '';
    if (this.movieData.videos && this.movieData.videos.results.length > 0) {
      const trailer = this.movieData.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      const video = trailer || this.movieData.videos.results.find(v => v.site === 'YouTube');
      
      if (video) {
        trailerHtml = `
          <div style="margin-bottom: var(--spacing-2xl);">
            <h3 style="margin-bottom: var(--spacing-lg);">Trailer</h3>
            <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 0.75rem;">
              <iframe 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                src="https://www.youtube.com/embed/${video.key}"
                title="Movie Trailer"
                frameborder="0"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        `;
      }
    }

    const budget = this.movieData.budget ? `<p><strong>Budget:</strong> ${this.formatCurrency(this.movieData.budget)}</p>` : '';
    const revenue = this.movieData.revenue ? `<p><strong>Revenue:</strong> ${this.formatCurrency(this.movieData.revenue)}</p>` : '';
    
    overviewContent.innerHTML = `
      <h2>Overview</h2>
      <p>${this.escapeHtml(this.movieData.overview)}</p>

      ${trailerHtml}

      <h3 style="margin-top: var(--spacing-2xl); margin-bottom: var(--spacing-lg);">Additional Information</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-xl);">
        <div>
          <h4 style="margin-bottom: var(--spacing-md);">Details</h4>
          <p><strong>Release Date:</strong> ${this.formatDate(this.movieData.release_date)}</p>
          <p><strong>Runtime:</strong> ${this.movieData.runtime ? this.movieData.runtime + ' minutes' : 'N/A'}</p>
          <p><strong>Language:</strong> ${this.movieData.original_language.toUpperCase()}</p>
          ${this.movieData.status ? `<p><strong>Status:</strong> ${this.movieData.status}</p>` : ''}
        </div>
        <div>
          <h4 style="margin-bottom: var(--spacing-md);">Financial</h4>
          ${budget}
          ${revenue}
          ${!budget && !revenue ? '<p>Financial information not available</p>' : ''}
        </div>
        ${this.movieData.production_companies && this.movieData.production_companies.length > 0 ? `
          <div>
            <h4 style="margin-bottom: var(--spacing-md);">Production Companies</h4>
            <ul style="list-style: none; padding: 0;">
              ${this.movieData.production_companies.map(c => `<li>${this.escapeHtml(c.name)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Display cast
   */
  displayCast() {
    const castContent = document.getElementById('cast-content');
    
    if (!this.movieData.credits || !this.movieData.credits.cast || this.movieData.credits.cast.length === 0) {
      castContent.innerHTML = '<p>Cast information not available</p>';
      return;
    }

    const cast = this.movieData.credits.cast.slice(0, 12);
    const crew = this.movieData.credits.crew
      .filter(member => ['Director', 'Writer', 'Producer'].includes(member.job))
      .slice(0, 6);

    let crewHtml = '';
    if (crew.length > 0) {
      crewHtml = `
        <h3 style="margin-top: var(--spacing-2xl); margin-bottom: var(--spacing-lg);">Crew</h3>
        <div class="cast-grid">
          ${crew.map(member => `
            <div class="cast-member">
              ${member.profile_path ? `
                <img 
                  src="${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.TMDB_IMAGE_SIZES.profile}${member.profile_path}"
                  alt="${this.escapeHtml(member.name)}"
                  class="cast-image"
                  loading="lazy"
                  onerror="this.src='assets/images/placeholder.png'"
                />
              ` : `<div class="cast-image" style="background-color: var(--color-bg-surface);"></div>`}
              <p class="cast-name">${this.escapeHtml(member.name)}</p>
              <p class="cast-character">${this.escapeHtml(member.job)}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    castContent.innerHTML = `
      <h3>Main Cast</h3>
      <div class="cast-grid">
        ${cast.map(member => `
          <div class="cast-member">
            ${member.profile_path ? `
              <img 
                src="${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.TMDB_IMAGE_SIZES.profile}${member.profile_path}"
                alt="${this.escapeHtml(member.name)}"
                class="cast-image"
                loading="lazy"
                onerror="this.src='assets/images/placeholder.png'"
              />
            ` : `<div class="cast-image" style="background-color: var(--color-bg-surface);"></div>`}
            <p class="cast-name">${this.escapeHtml(member.name)}</p>
            <p class="cast-character">${this.escapeHtml(member.character)}</p>
          </div>
        `).join('')}
      </div>
      ${crewHtml}
    `;
  }

  /**
   * Display streaming providers
   */
  async displayStreamingProviders() {
    const streamingContent = document.getElementById('streaming-content');
    
    if (!this.movieData['watch/providers'] || !this.movieData['watch/providers'].results) {
      streamingContent.innerHTML = `
        <h3>Where to Watch</h3>
        <p>Streaming information is not available for your region at this time.</p>
        <p style="margin-top: var(--spacing-lg);">Try using a VPN to access content from different regions:</p>
        <a href="https://www.nordvpn.com" target="_blank" rel="noopener" class="affiliate-button" style="margin-top: var(--spacing-lg);">
          Unlock Global Streaming with NordVPN
        </a>
      `;
      return;
    }

    const results = this.movieData['watch/providers'].results;
    const currentCountry = 'US'; // Can be enhanced with geolocation
    const countryData = results[currentCountry] || Object.values(results)[0];

    if (!countryData) {
      streamingContent.innerHTML = `
        <h3>Where to Watch</h3>
        <p>Streaming information is not available at this time.</p>
      `;
      return;
    }

    let providersHtml = '';
    if (countryData.flatrate && countryData.flatrate.length > 0) {
      providersHtml += `
        <div style="margin-bottom: var(--spacing-xl);">
          <h4 style="margin-bottom: var(--spacing-lg);">Stream On</h4>
          <div class="streaming-providers">
            ${countryData.flatrate.map(provider => `
              <div class="provider-item">
                <img 
                  src="${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.TMDB_IMAGE_SIZES.logo}${provider.logo_path}"
                  alt="${provider.provider_name}"
                  class="provider-logo"
                  title="${provider.provider_name}"
                  loading="lazy"
                />
                <span class="provider-name">${provider.provider_name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (countryData.buy && countryData.buy.length > 0) {
      providersHtml += `
        <div style="margin-bottom: var(--spacing-xl);">
          <h4 style="margin-bottom: var(--spacing-lg);">Buy On</h4>
          <div class="streaming-providers">
            ${countryData.buy.map(provider => `
              <div class="provider-item">
                <img 
                  src="${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.TMDB_IMAGE_SIZES.logo}${provider.logo_path}"
                  alt="${provider.provider_name}"
                  class="provider-logo"
                  title="${provider.provider_name}"
                  loading="lazy"
                />
                <span class="provider-name">${provider.provider_name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (countryData.rent && countryData.rent.length > 0) {
      providersHtml += `
        <div style="margin-bottom: var(--spacing-xl);">
          <h4 style="margin-bottom: var(--spacing-lg);">Rent On</h4>
          <div class="streaming-providers">
            ${countryData.rent.map(provider => `
              <div class="provider-item">
                <img 
                  src="${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.TMDB_IMAGE_SIZES.logo}${provider.logo_path}"
                  alt="${provider.provider_name}"
                  class="provider-logo"
                  title="${provider.provider_name}"
                  loading="lazy"
                />
                <span class="provider-name">${provider.provider_name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (!providersHtml) {
      providersHtml = '<p>No streaming providers found for your region</p>';
    }

    streamingContent.innerHTML = `
      <h3>Where to Watch</h3>
      ${providersHtml}
      <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-top: var(--spacing-lg);">
        Availability varies by region and changes over time. Data provided by TMDB.
      </p>
    `;
  }

  /**
   * Display similar movies
   */
  async displaySimilarMovies() {
    const similarContent = document.getElementById('similar-content');
    
    if (!this.movieData.recommendations || !this.movieData.recommendations.results || this.movieData.recommendations.results.length === 0) {
      similarContent.innerHTML = '<p>No similar movies found</p>';
      return;
    }

    const movies = this.movieData.recommendations.results.slice(0, 12);
    similarContent.innerHTML = `
      <h3>Similar Movies</h3>
      <div class="movies-grid" style="margin-top: var(--spacing-xl);">
        ${movies.map(movie => this.createMovieCard(movie)).join('')}
      </div>
    `;
  }
}

// Initialize movie page
document.addEventListener('DOMContentLoaded', () => {
  new MoviePage();
});
