/**
 * DEAL HUNTER - Real API Integration
 * Fetches live data from Amazon via RapidAPI
 */

// ============================================
// 🔑 API CONFIGURATION
// ============================================

// TODO: YAHA APNI KEY PASTE KAR 👇
const RAPID_API_KEY = 'f273bac7c8msh2aa7a560484e824p115ce5jsn1087c9cd67e0'; 

const RAPID_API_HOST = 'real-time-amazon-data.p.rapidapi.com';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clean up price string (API returns symbols, we format it nicely)
 */
function formatPrice(price) {
    if (!price) return 'Check Site';
    return price; // API usually sends formatted string like "₹1,29,900"
}

/**
 * Add Affiliate Tag to URL (Paisa Banane ka Logic 💰)
 */
function getAffiliateLink(url) {
    // Jab tu Amazon Associates join karega, apna tag yahan daal dena
    const myTag = 'arnavdeals-21'; 
    if (url.includes('?')) {
        return `${url}&tag=${myTag}`;
    } else {
        return `${url}?tag=${myTag}`;
    }
}

// ============================================
// API SEARCH FUNCTION
// ============================================

async function fetchAmazonDeals(query) {
    const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=IN&sort_by=RELEVANCE&product_condition=NEW`;
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        // Check if data exists
        if (data.data && data.data.products) {
            return data.data.products.map((item, index) => ({
                id: item.asin || index, // ASIN is Amazon's unique ID
                title: item.product_title,
                price: item.product_price,
                originalPrice: item.product_original_price,
                discount: null, // API sometimes doesn't send % calc, we can skip or calc manually
                store: "Amazon",
                storeClass: "amazon",
                image: item.product_photo,
                productUrl: item.product_url,
                badge: item.is_best_seller ? "Best Seller" : (item.is_amazon_choice ? "Amazon's Choice" : null)
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("API Error:", error);
        showCyberAlert("System Error: Could not connect to Deal Network.");
        return [];
    }
}

// ============================================
// UI FUNCTIONS
// ============================================

/**
 * Create HTML for a product card
 */
function createProductCard(product, index) {
    const badgeHTML = product.badge 
        ? `<span class="product-badge">${product.badge}</span>` 
        : '';
    
    // Check if original price exists for strikethrough
    const originalPriceHTML = product.originalPrice 
        ? `<span class="product-original-price">${product.originalPrice}</span>` 
        : '';
    
    const affiliateLink = getAffiliateLink(product.productUrl);
    
    return `
        <div class="product-card fade-in stagger-${(index % 5) + 1}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                ${badgeHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title" title="${product.title}">${product.title}</h3>
                <div class="product-price-row">
                    <div>
                        <span class="product-price">
                            ${formatPrice(product.price)}
                        </span>
                        ${originalPriceHTML}
                    </div>
                </div>
                <div class="store-info">
                    <span class="store-label">Source:</span>
                    <span class="store-name ${product.storeClass}">${product.store}</span>
                </div>
                <a href="${affiliateLink}" target="_blank" class="buy-btn" style="text-align:center; text-decoration:none; display:block;">
                    GRAB DEAL
                </a>
            </div>
        </div>
    `;
}

/**
 * Render products to the grid
 */
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!products || products.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        resultsCount.textContent = '';
        return;
    }
    
    noResults.style.display = 'none';
    resultsCount.textContent = `(${products.length} found)`;
    
    grid.innerHTML = products.map((product, index) => 
        createProductCard(product, index)
    ).join('');
}

/**
 * Show loading animation
 */
function showLoading() {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.classList.add('active');
    
    // Reset animation
    const progress = loadingBar.querySelector('.loading-progress');
    progress.style.animation = 'none';
    progress.offsetHeight; // Trigger reflow
    progress.style.animation = 'loading 1s ease-in-out forwards';
}

/**
 * Hide loading animation
 */
function hideLoading() {
    const loadingBar = document.getElementById('loadingBar');
    setTimeout(() => {
        loadingBar.classList.remove('active');
    }, 500);
}

/**
 * Handle search functionality
 */
async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) return;

    showLoading();
    
    // Clear previous results while loading
    document.getElementById('productsGrid').innerHTML = '';
    document.getElementById('noResults').style.display = 'none';
    
    // Call the Real API
    const results = await fetchAmazonDeals(query);
    
    renderProducts(results);
    hideLoading();
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Show cyberpunk styled alert
 */
function showCyberAlert(message) {
    const existingAlert = document.querySelector('.cyber-alert');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = 'cyber-alert';
    alert.innerHTML = `
        <div class="cyber-alert-content">
            <span class="cyber-alert-icon">⚠️</span>
            <span class="cyber-alert-text">${message}</span>
        </div>
    `;
    
    alert.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: rgba(255, 0, 60, 0.1); border: 1px solid #ff003c;
        border-radius: 8px; padding: 1rem; z-index: 10000;
        color: white; font-family: 'Rajdhani', sans-serif;
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

/**
 * Create floating particles (Visual Effect)
 */
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Quick tags click
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.getAttribute('data-query');
            searchInput.value = query;
            handleSearch();
        });
    });
});

// Console Signature
console.log('%c DEAL HUNTER v2.0 ', 'background: #00ff41; color: #000; font-weight: bold;');
