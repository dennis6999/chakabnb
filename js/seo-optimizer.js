/**
 * ChakaBNB SEO & Performance Optimization System
 * Comprehensive SEO enhancements and performance optimizations
 */

class SEOOptimizer {
    constructor() {
        this.structuredData = [];
        this.metaTags = {};
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.addStructuredData();
        this.optimizeMetaTags();
        this.implementLazyLoading();
        this.optimizeImages();
        this.addPerformanceMonitoring();
        this.implementCriticalCSS();
        this.addServiceWorker();
    }

    /**
     * Add structured data for better SEO
     */
    addStructuredData() {
        // Organization structured data
        const organizationData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ChakaBNB",
            "description": "Professional vacation rental booking platform for Chaka Town, Nyeri County, Kenya",
            "url": window.location.origin,
            "logo": `${window.location.origin}/logo.png`,
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+254-XXX-XXXXXX",
                "contactType": "customer service",
                "areaServed": "KE",
                "availableLanguage": ["English", "Swahili"]
            },
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Chaka Town",
                "addressRegion": "Nyeri County",
                "addressCountry": "KE"
            },
            "sameAs": [
                "https://facebook.com/chakabnb",
                "https://twitter.com/chakabnb",
                "https://instagram.com/chakabnb"
            ]
        };

        // Website structured data
        const websiteData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ChakaBNB",
            "url": window.location.origin,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${window.location.origin}/search-results.html?location={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };

        // Add property listings structured data
        this.addPropertyListingsStructuredData();

        // Add all structured data to page
        this.addStructuredDataToPage([organizationData, websiteData]);
    }

    /**
     * Add property listings structured data
     */
    addPropertyListingsStructuredData() {
        const propertyCards = document.querySelectorAll('.property-card');
        
        propertyCards.forEach((card, index) => {
            const title = card.querySelector('h3, .property-title')?.textContent;
            const price = card.querySelector('.property-price')?.textContent;
            const location = card.querySelector('.property-location')?.textContent;
            const rating = card.querySelector('.property-rating')?.textContent;
            const image = card.querySelector('img')?.src;
            const link = card.querySelector('a')?.href;

            if (title && price && location) {
                const propertyData = {
                    "@context": "https://schema.org",
                    "@type": "LodgingBusiness",
                    "name": title,
                    "description": `Beautiful vacation rental in ${location}`,
                    "url": link || window.location.href,
                    "image": image || `${window.location.origin}/logo.png`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": location,
                        "addressRegion": "Nyeri County",
                        "addressCountry": "KE"
                    },
                    "priceRange": this.extractPriceRange(price),
                    "aggregateRating": rating ? {
                        "@type": "AggregateRating",
                        "ratingValue": this.extractRating(rating),
                        "reviewCount": "1"
                    } : undefined
                };

                this.structuredData.push(propertyData);
            }
        });
    }

    /**
     * Extract price range from price text
     * @param {string} priceText - Price text
     * @returns {string} - Price range
     */
    extractPriceRange(priceText) {
        const price = priceText.replace(/[^\d]/g, '');
        if (price) {
            return `KSh ${price}`;
        }
        return "KSh 1000-10000";
    }

    /**
     * Extract rating from rating text
     * @param {string} ratingText - Rating text
     * @returns {string} - Rating value
     */
    extractRating(ratingText) {
        const rating = ratingText.match(/(\d+\.?\d*)/);
        return rating ? rating[1] : "4.5";
    }

    /**
     * Add structured data to page
     * @param {Array} dataArray - Array of structured data objects
     */
    addStructuredDataToPage(dataArray) {
        dataArray.forEach(data => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        });
    }

    /**
     * Optimize meta tags for SEO
     */
    optimizeMetaTags() {
        const currentPage = this.getCurrentPage();
        
        // Page-specific meta tags
        const pageMetaTags = {
            'index': {
                title: 'ChakaBNB - Vacation Rentals in Chaka Town, Nyeri | Book Your Perfect Stay',
                description: 'Discover amazing vacation rentals in Chaka Town, Nyeri County. Book unique accommodations near Solio Game Reserve and Baden-Powell Museum. Best prices guaranteed!',
                keywords: 'vacation rentals, Chaka Town, Nyeri, Kenya, Solio Game Reserve, Baden-Powell Museum, accommodation, booking'
            },
            'search-results': {
                title: 'Search Results - Find Your Perfect Vacation Rental | ChakaBNB',
                description: 'Browse our selection of vacation rentals in Chaka Town. Filter by price, amenities, and location to find your ideal accommodation.',
                keywords: 'vacation rental search, Chaka Town properties, accommodation booking, Nyeri County rentals'
            },
            'property-detail': {
                title: 'Property Details - Luxury Vacation Rental | ChakaBNB',
                description: 'View detailed information about this beautiful vacation rental. Check availability, amenities, and book your stay today.',
                keywords: 'property details, vacation rental, booking, amenities, availability'
            },
            'login': {
                title: 'Sign In - ChakaBNB Account Login',
                description: 'Sign in to your ChakaBNB account to manage bookings, list properties, and access exclusive features.',
                keywords: 'login, sign in, account, ChakaBNB'
            },
            'register': {
                title: 'Create Account - Join ChakaBNB Today',
                description: 'Create your ChakaBNB account to start booking amazing vacation rentals or list your property for rent.',
                keywords: 'register, create account, sign up, ChakaBNB membership'
            },
            'list-property': {
                title: 'List Your Property - Become a ChakaBNB Host',
                description: 'List your property on ChakaBNB and start earning money by hosting travelers in Chaka Town, Nyeri County.',
                keywords: 'list property, become host, property listing, vacation rental host'
            }
        };

        const metaData = pageMetaTags[currentPage] || pageMetaTags['index'];
        
        // Update title
        document.title = metaData.title;
        
        // Update or create meta description
        this.updateMetaTag('description', metaData.description);
        
        // Update or create meta keywords
        this.updateMetaTag('keywords', metaData.keywords);
        
        // Add Open Graph tags
        this.addOpenGraphTags(metaData);
        
        // Add Twitter Card tags
        this.addTwitterCardTags(metaData);
        
        // Add canonical URL
        this.addCanonicalURL();
    }

    /**
     * Get current page identifier
     * @returns {string} - Page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        if (filename === 'index' || filename === '') return 'index';
        return filename;
    }

    /**
     * Update or create meta tag
     * @param {string} name - Meta tag name
     * @param {string} content - Meta tag content
     */
    updateMetaTag(name, content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = name;
            document.head.appendChild(metaTag);
        }
        
        metaTag.content = content;
    }

    /**
     * Add Open Graph tags
     * @param {object} metaData - Meta data object
     */
    addOpenGraphTags(metaData) {
        const ogTags = {
            'og:title': metaData.title,
            'og:description': metaData.description,
            'og:type': 'website',
            'og:url': window.location.href,
            'og:image': `${window.location.origin}/logo.png`,
            'og:site_name': 'ChakaBNB',
            'og:locale': 'en_KE'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            this.updateMetaTag(property, content, 'property');
        });
    }

    /**
     * Add Twitter Card tags
     * @param {object} metaData - Meta data object
     */
    addTwitterCardTags(metaData) {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': metaData.title,
            'twitter:description': metaData.description,
            'twitter:image': `${window.location.origin}/logo.png`,
            'twitter:site': '@chakabnb',
            'twitter:creator': '@chakabnb'
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            this.updateMetaTag(name, content);
        });
    }

    /**
     * Add canonical URL
     */
    addCanonicalURL() {
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        
        canonicalLink.href = window.location.href;
    }

    /**
     * Implement lazy loading for images
     */
    implementLazyLoading() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Optimize images
     */
    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });

        // Add alt text to images without it
        document.querySelectorAll('img:not([alt])').forEach(img => {
            const context = this.getImageContext(img);
            img.alt = context;
        });

        // Convert images to WebP format (if supported)
        this.convertToWebP();
    }

    /**
     * Get image context for alt text
     * @param {HTMLImageElement} img - Image element
     * @returns {string} - Alt text
     */
    getImageContext(img) {
        const parent = img.closest('.property-card, .gallery-item, .hero-image');
        
        if (parent) {
            const title = parent.querySelector('h1, h2, h3, .title, .property-title');
            if (title) {
                return `${title.textContent} - ChakaBNB`;
            }
        }
        
        return 'ChakaBNB vacation rental image';
    }

    /**
     * Convert images to WebP format
     */
    convertToWebP() {
        // Check if WebP is supported
        const webpSupported = this.checkWebPSupport();
        
        if (webpSupported) {
            document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').forEach(img => {
                const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                
                // Create a new image to test if WebP version exists
                const testImg = new Image();
                testImg.onload = () => {
                    img.src = webpSrc;
                };
                testImg.src = webpSrc;
            });
        }
    }

    /**
     * Check WebP support
     * @returns {boolean} - Whether WebP is supported
     */
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * Add performance monitoring
     */
    addPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor page load time
        this.monitorPageLoadTime();
        
        // Monitor resource loading
        this.monitorResourceLoading();
    }

    /**
     * Monitor Core Web Vitals
     */
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    /**
     * Monitor page load time
     */
    monitorPageLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.performanceMetrics.loadTime = loadTime;
            
            // Log performance metrics
            console.log('Performance Metrics:', this.performanceMetrics);
        });
    }

    /**
     * Monitor resource loading
     */
    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 1000) { // Resources taking more than 1 second
                        console.warn('Slow loading resource:', entry.name, entry.duration + 'ms');
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    /**
     * Implement critical CSS
     */
    implementCriticalCSS() {
        // Add critical CSS for above-the-fold content
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; }
            .hero-section { min-height: 100vh; background: linear-gradient(135deg, #003B95 0%, #4CAF50 100%); }
            .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .btn-primary { background: #003B95; color: white; padding: 12px 24px; border: none; border-radius: 6px; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    /**
     * Add service worker for caching
     */
    addServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    /**
     * Generate sitemap data
     * @returns {Array} - Sitemap URLs
     */
    generateSitemap() {
        const baseUrl = window.location.origin;
        const pages = [
            { url: '/', priority: 1.0, changefreq: 'daily' },
            { url: '/search-results.html', priority: 0.8, changefreq: 'daily' },
            { url: '/property-detail.html', priority: 0.7, changefreq: 'weekly' },
            { url: '/login.html', priority: 0.5, changefreq: 'monthly' },
            { url: '/register.html', priority: 0.5, changefreq: 'monthly' },
            { url: '/list-property.html', priority: 0.6, changefreq: 'monthly' }
        ];

        return pages.map(page => ({
            ...page,
            url: baseUrl + page.url,
            lastmod: new Date().toISOString().split('T')[0]
        }));
    }

    /**
     * Generate robots.txt content
     * @returns {string} - Robots.txt content
     */
    generateRobotsTxt() {
        return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${window.location.origin}/sitemap.xml`;
    }
}

// Global SEO optimizer instance
window.seoOptimizer = new SEOOptimizer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOOptimizer;
}
