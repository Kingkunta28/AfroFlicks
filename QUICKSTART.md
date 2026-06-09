# Quick Start Guide - AfroFlicks

Welcome to **AfroFlicks** - Africa's Movies, One Click Away! 🎬

This is your complete, production-ready movie discovery platform. Here's how to get started in 5 minutes.

## 🚀 Get Your TMDB API Key (Required)

1. Visit: https://www.themoviedb.org/settings/api
2. Create a free account (if needed)
3. Request an API key
4. Copy your **Bearer Token** (long encrypted string)
5. You'll get something like: `eyJhbGciOiJIUzI1NiJ9...`

## ⚙️ Configure Your API Key

1. Open: `assets/js/config.js`
2. Find this line:
   ```javascript
   TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE',
   ```
3. Replace with your actual Bearer Token:
   ```javascript
   TMDB_API_KEY: 'eyJhbGciOiJIUzI1NiJ9...',
   ```
4. Save the file

## 🌐 Run Locally

### Using Python (Most Common)

```bash
# Navigate to project folder
cd path/to/afroflicks

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Using Node.js

```bash
npm install -g http-server
http-server
```

### Using VS Code

```bash
# Install "Live Server" extension
# Right-click index.html > "Open with Live Server"
```

## 🌍 Access Your Site

Open your browser and go to:
```
http://localhost:8000
```

You should see the beautiful AfroFlicks home page! 🎉

## ✨ What You Can Do Now

✅ Search for any movie  
✅ View movie details, trailers, and ratings  
✅ Add to favorites and watch later lists  
✅ Filter by genre, year, and rating  
✅ Browse trending and popular movies  
✅ Experience mobile-responsive design  

## 📁 Project Structure

```
afroflicks/
├── index.html              ← Home page
├── movie.html              ← Movie details
├── search.html             ← Search page
├── genre.html              ← Browse by genre
├── favorites.html          ← Your favorites
├── watchlater.html         ← Watch later list
├── assets/
│   ├── css/style.css       ← Main styling
│   ├── js/
│   │   ├── config.js       ← API configuration ⭐ EDIT THIS
│   │   └── app.js          ← Core functionality
└── README.md               ← Full documentation
```

## 🎨 Customize the Look

Edit `assets/css/style.css` to change:
- Colors (search `:root` section)
- Fonts and sizes
- Animations and transitions
- Responsive breakpoints

## 📱 Test Responsive Design

1. Open DevTools (F12)
2. Click device toggle (mobile icon)
3. Try different screen sizes:
   - Mobile: 320px
   - Tablet: 768px
   - Desktop: 1024px

## 🚀 Deploy to the Web

When ready, deploy to:

### Netlify (Recommended)
```bash
# Drag and drop at: https://app.netlify.com
# or git integration
```

### Vercel
```bash
npm i -g vercel
vercel
```

### GitHub Pages
```bash
git push to username.github.io repository
```

See `DEPLOYMENT.md` for detailed instructions.

## 🔧 Common Tasks

### Change Affiliate Links
Edit `assets/js/config.js`:
```javascript
AFFILIATE_LINKS: {
  nordvpn: 'your-link-here',
  showmax: 'your-link-here',
  prime_video: 'your-link-here'
}
```

### Change Site Title
Edit `assets/js/app.js`:
```javascript
setDynamicMetaTags('Your Title', 'Your Description')
```

### Add Analytics
Edit index.html `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🆘 Troubleshooting

**Problem:** "API Error" appears
- ✅ Check your TMDB API key in `config.js`
- ✅ Verify internet connection
- ✅ Try refreshing the page

**Problem:** Movies don't load
- ✅ Open browser console (F12)
- ✅ Check for error messages
- ✅ Verify API key is correct

**Problem:** Images show as broken
- ✅ This is normal for some movies (no image available)
- ✅ The app shows a placeholder instead
- ✅ Check browser console for errors

**Problem:** Favorites not saving
- ✅ Check if localStorage is enabled
- ✅ Disable private/incognito mode
- ✅ Clear browser cache and reload

## 📚 Learn More

- [TMDB API Docs](https://developer.themoviedb.org/3)
- [AfroFlicks Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Privacy & Terms](privacy.html)

## 💡 Pro Tips

1. **Use Search Filters** - Sort by year, rating, popularity
2. **Save Watch Later** - Build your personal queue
3. **Create Favorites** - Easy access to loved movies
4. **Offline Mode** - PWA works offline with cached data
5. **Mobile Friendly** - Fully responsive on all devices

## 🎯 Next Steps

1. ✅ Configure your API key
2. ✅ Run the site locally
3. ✅ Explore all features
4. ✅ Customize colors/branding
5. ✅ Deploy to production

## 📞 Support

- Email: support@afroflicks.com
- Issues: Check browser console (F12)
- Docs: See README.md for complete guide

## 📋 Quick Checklist

- [ ] TMDB API key added
- [ ] Site runs locally
- [ ] Tested on mobile
- [ ] Customized branding (optional)
- [ ] Ready to deploy

---

## 🎉 You're All Set!

Your production-ready movie discovery platform is ready to go.

**Have fun discovering Africa's best cinema!** 🎬✨

**AfroFlicks - Africa's Movies, One Click Away**

---

**Version 1.0.0** | Built with ❤️ for movie lovers worldwide
