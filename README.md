# AfroFlicks - Africa's Movies, One Click Away

A premium movie discovery and streaming guide platform built with vanilla HTML, CSS, and JavaScript. Powered by TMDB API.

## Features

- ✨ **Dynamic Movie Data** - Real-time data from TMDB API
- 🎬 **Movie Details** - Ratings, trailers, cast, crew, production info
- 🔍 **Advanced Search** - Search, filter, and sort movies
- ❤️ **Favorites & Watch Later** - Persistent lists using localStorage
- 📱 **Fully Responsive** - Mobile-first design (320px+)
- ⚡ **PWA Support** - Works offline with service worker
- 🎨 **Stunning UI** - Netflix-quality design with animations
- ♿ **Accessibility** - WCAG AA compliant
- 🔒 **Security** - XSS protection and input sanitization
- 📊 **Performance** - Optimized for Lighthouse 90+

## File Structure

```
afroflicks/
├── index.html              # Home page
├── movie.html              # Movie details page
├── search.html             # Search results page
├── genre.html              # Genre page
├── favorites.html          # Favorites page
├── watchlater.html         # Watch later page
├── about.html              # About page
├── privacy.html            # Privacy & terms
├── 404.html                # 404 error page
├── service-worker.js       # PWA service worker
├── manifest.json           # PWA manifest
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── config.js       # Configuration
│   │   ├── app.js          # Core functionality
│   │   ├── index.js        # Home page scripts
│   │   ├── movie.js        # Movie page scripts
│   │   ├── search.js       # Search page scripts
│   │   ├── genre.js        # Genre page scripts
│   │   ├── favorites.js    # Favorites page scripts
│   │   └── watchlater.js   # Watch later scripts
│   ├── icons/              # PWA icons
│   └── images/             # Placeholder images
└── README.md               # This file
```

## Getting Started

### Prerequisites

- A TMDB API Key (free at https://www.themoviedb.org/settings/api)
- A modern web browser
- A local web server (for development)

### Setup

1. **Clone or download the project**

2. **Get TMDB API Key**
   - Visit https://www.themoviedb.org/settings/api
   - Create an account if needed
   - Generate an API key
   - Copy your Bearer Token

3. **Configure API Key**
   - Open `assets/js/config.js`
   - Replace `YOUR_TMDB_API_KEY_HERE` with your actual Bearer Token
   - Save the file

4. **Run a Local Server**
   
   Using Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Using Python 2:
   ```bash
   python -m SimpleHTTPServer 8000
   ```
   
   Using Node.js (with http-server):
   ```bash
   npx http-server
   ```

5. **Access the Application**
   - Open http://localhost:8000 in your browser
   - Enjoy!

## Deployment

AfroFlicks is static HTML/CSS/JavaScript and can be deployed to:

- **Netlify** - Drag and drop deployment
- **Vercel** - Optimized for performance
- **GitHub Pages** - Free hosting
- **Any static hosting provider**

### Deployment Steps

1. Push code to a repository (GitHub, GitLab, etc.)
2. Connect repository to your hosting platform
3. Configure build settings (usually not needed for static sites)
4. Deploy
5. Access your live URL

## Configuration

### API Configuration

Edit `assets/js/config.js` to modify:
- TMDB API credentials
- Image sizes and URLs
- Affiliate links
- API timeouts
- Debounce delays
- Cache duration

### Customization

**Branding Colors:**
- Edit CSS variables in `assets/css/style.css`
- Primary colors, text, backgrounds

**Animations:**
- Modify animation durations in CSS variables
- Adjust timing in individual animations

**Content:**
- Update text in HTML files
- Modify API endpoints in JavaScript files

## Features Explained

### Dynamic Data
All movie data is fetched from TMDB API in real-time. No static data is hardcoded.

### Search & Filters
- Live search with debounce
- Filter by year, rating, language
- Sort by popularity, rating, release date

### Favorites & Watch Later
- Stored in browser localStorage
- Persistent across sessions
- Easy add/remove functionality

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- All elements scale appropriately

### Offline Support
- Service worker caches static assets
- Offline error page
- Graceful degradation

### Accessibility
- Semantic HTML
- Proper ARIA labels
- Keyboard navigation
- Focus states
- Screen reader support

## API Rate Limits

TMDB API has rate limits:
- Free tier: 40 requests per 10 seconds
- Cached requests don't count against limits
- Built-in retry and error handling

## Security

- XSS Protection: All user input sanitized
- Input Validation: Checked before use
- HTTPS Recommended: Always use HTTPS in production
- No Credential Storage: API key can be visible (read-only)

## Performance Optimization

- Lazy loading images
- Skeleton loaders for better perceived performance
- API response caching
- Debounced search input
- Infinite scroll for large datasets
- Minified CSS

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### "API Error" Messages

**Solution:** Check TMDB API key in `config.js`

### Movies Not Loading

**Solutions:**
1. Verify TMDB API key
2. Check internet connection
3. Clear browser cache
4. Check browser console for errors

### Images Not Showing

**Solutions:**
1. Check image URL format
2. Verify TMDB has image for that movie
3. Clear browser cache
4. Check CORS settings

### Favorites Not Persisting

**Solutions:**
1. Check if localStorage is enabled
2. Clear browser data and try again
3. Disable privacy/incognito mode

## Development

### Adding New Features

1. Create feature branch
2. Add HTML structure in relevant page
3. Add CSS styles to `style.css`
4. Add JavaScript to appropriate js file
5. Test thoroughly
6. Deploy

### Code Standards

- ES6+ JavaScript
- Semantic HTML
- Mobile-first CSS
- Comments for complex logic
- Consistent naming conventions

## Credits

- **TMDB API** - Movie data source
- **TMDB Community** - Collaborative database
- **Icons** - Custom SVG icons
- **Fonts** - System fonts (no external dependencies)

## License

This project is provided as-is for personal and educational use.

### Third-Party Licenses

- TMDB API: https://www.themoviedb.org/settings/api
- YouTube: Google Terms of Service
- Streaming data: TMDB Community

## Support

Issues, Questions, or Suggestions?

Email: support@afroflicks.com

## Changelog

### Version 1.0.0 (Initial Release)
- Complete home page with trending, popular, top-rated, upcoming
- Movie details page with trailers, cast, crew
- Search with filters and sorting
- Genre browsing
- Favorites and Watch Later lists
- About and Privacy pages
- Responsive design (mobile, tablet, desktop)
- PWA support
- Dark theme with gold accents
- Full accessibility support
- Production-ready code

## Future Enhancements

- Multi-language support
- User accounts and cloud sync
- Social sharing
- Movie reviews and ratings
- Advanced recommendations
- Similar movies carousel
- Genre-specific recommendations
- Collections and watchlists
- Mobile app
- VR/AR features

## Disclaimer

This product uses the TMDB API but is not endorsed or certified by TMDB.

Movie content, images, and data are provided by TMDB and associated partners.

---

Built with ❤️ for African cinema lovers worldwide.

**AfroFlicks - Africa's Movies, One Click Away**
"# AfroFlicks" 
