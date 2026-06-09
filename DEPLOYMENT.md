# AfroFlicks Deployment Guide

## Quick Deployment Options

### 1. Netlify (Recommended)

**Easiest Option**

```bash
# Option 1: Drag and Drop
1. Go to https://app.netlify.com
2. Drag your entire project folder into the drop zone
3. Your site is live!

# Option 2: Git Integration
1. Push code to GitHub, GitLab, or Bitbucket
2. Connect to Netlify
3. Select branch to deploy
4. Netlify handles everything automatically
```

**Features:**
- Free HTTPS
- Automatic builds
- Environment variables (for API keys)
- Global CDN
- Deploy previews

### 2. Vercel

**Best Performance**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Features:**
- Optimized for speed
- Edge functions
- Automatic deployments
- Preview URLs

### 3. GitHub Pages

**Free Static Hosting**

```bash
# Create a new repository named: username.github.io
git clone https://github.com/username/username.github.io
cd username.github.io

# Copy AfroFlicks files here
cp -r path/to/afroflicks/* .

# Commit and push
git add .
git commit -m "Deploy AfroFlicks"
git push origin main

# Access at: https://username.github.io
```

### 4. Traditional Hosting (Apache/Nginx)

**If you have a VPS or shared hosting:**

```bash
# Via FTP/SFTP:
1. Connect to your server via FTP client
2. Upload all files to public_html or www directory
3. Ensure .htaccess is in root directory
4. Set proper permissions (755 for directories, 644 for files)
5. Access your domain

# Via SSH (Recommended):
ssh user@your-domain.com
cd public_html
git clone https://github.com/yourusername/afroflicks.git .
chmod -R 755 .
chmod -R 644 *.html *.js *.css
```

## Pre-Deployment Checklist

- [ ] Replace TMDB API key in `config.js`
- [ ] Update affiliate links (NordVPN, Showmax, Prime Video)
- [ ] Test all pages locally
- [ ] Verify search functionality
- [ ] Check movie details page
- [ ] Test offline functionality
- [ ] Verify responsive design
- [ ] Update contact email
- [ ] Set up SSL/HTTPS
- [ ] Configure domain DNS
- [ ] Test on mobile devices
- [ ] Check Page Speed Insights
- [ ] Verify Google AdSense setup (if using)

## Environment Setup

### Netlify Environment Variables

```
VITE_TMDB_API_KEY=your_actual_api_key
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

Go to: **Site settings → Build & deploy → Environment**

### Vercel Environment Variables

```
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key
```

Go to: **Project settings → Environment Variables**

## Custom Domain Setup

### Netlify
```
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records (CNAME or A records)
4. Wait for SSL certificate (automatic)
```

### Vercel
```
1. Go to Project settings → Domains
2. Add domain
3. Add DNS records
4. Vercel manages SSL
```

### Traditional Hosting
```
1. Update DNS at domain registrar
2. Point to your server's IP
3. Configure SSL certificate (Let's Encrypt is free)
```

## SSL/HTTPS Setup

### Netlify & Vercel
- Automatic and free

### Let's Encrypt (for VPS)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-apache

# Generate certificate
sudo certbot certonly --apache -d yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

## Performance Optimization

### Image Optimization
```bash
# Use webp format
ffmpeg -i image.jpg -c:v libwebp -q 80 image.webp

# Resize images
ffmpeg -i image.jpg -vf scale=1280:-1 image-lg.jpg
```

### Minification
```bash
# CSS
npm install -g cleancss-cli
cleancss assets/css/style.css > assets/css/style.min.css

# JavaScript (optional, browsers cache anyway)
npm install -g terser
terser assets/js/app.js > assets/js/app.min.js
```

### Enable Gzip Compression
- Netlify: Automatic
- Vercel: Automatic
- Apache: Enabled in .htaccess
- Nginx: Enabled in nginx.conf

## Monitoring & Analytics

### Google Analytics
```html
<!-- Add to header -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Error Tracking (Sentry)
```html
<!-- Add to header -->
<script src="https://browser.sentry-cdn.com/VERSION/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "YOUR_DSN",
    tracesSampleRate: 1.0
  });
</script>
```

## SEO Setup

### Sitemap (auto-generated)
```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://afroflicks.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://afroflicks.com/search.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://afroflicks.com/about.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://afroflicks.com/sitemap.xml
Disallow: /admin
Disallow: /.well-known
```

## Google AdSense Integration

```html
<!-- Header Banner -->
<div style="margin-bottom: var(--spacing-2xl);">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script>
  <!-- AfroFlicks Header -->
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
       data-ad-slot="1234567890"
       data-ad-format="horizontal"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

## Troubleshooting

### 404 Errors
- Check .htaccess is uploaded
- Verify Apache mod_rewrite is enabled
- Ensure error_page is configured

### API Not Working
- Verify TMDB API key
- Check CORS is enabled
- Test API directly: `curl https://api.themoviedb.org/3/trending/movie/day?language=en-US`

### Images Not Loading
- Check CDN cache
- Verify TMDB API endpoints
- Check image URLs in response

### Slow Performance
- Enable caching
- Use CDN
- Optimize images
- Minify CSS/JS
- Check server response time

## Rollback

```bash
# If deployment breaks
git revert HEAD
git push
```

## Backup Strategy

```bash
# Regular backups
git push origin main
git tag v1.0.0
git push origin v1.0.0

# Automated backups (GitHub Actions)
# or use automated backup tools from hosting provider
```

## Support

Need help? Contact:
- Netlify Support: support@netlify.com
- Vercel Support: support@vercel.com
- TMDB: https://www.themoviedb.org/talk

---

**Happy Deploying!** 🚀
