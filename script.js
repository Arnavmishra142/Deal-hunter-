/**
 * DEAL HUNTER - FINAL PRO VERSION
 * Hybrid Design Logic (Amazon Style Cards + Cyberpunk Theme)
 */

// 🔑 API CONFIGURATION
const RAPID_API_KEY = 'f273bac7c8msh2aa7a560484e824p115ce5jsn1087c9cd67e0'; 
const RAPID_API_HOST = 'real-time-amazon-data.p.rapidapi.com';

// UTILS
function formatPrice(price) {
    if (!price) return 'Check Site';
    return price;
}

function getAffiliateLink(url) {
    const myTag = 'arnavdeals-21'; 
    if (!url) return '#';
    return url.includes('?') ? `${url}&tag=${myTag}` : `${url}?tag=${myTag}`;
}

// API FETCH
async function fetchAmazonDeals(query) {
    console.log(`Searching for: ${query}...`);
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
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        
        let products = [];
        if (data.data && data.data.products) products = data.data.products;
        else if (data.products) products = data.products;

        return products.map((item, index) => ({
            id: item.asin || index,
            title: item.product_title || "No Title Available",
            price: item.product_price || null,
            originalPrice: item.product_original_price || null,
            store: "Amazon",
            image: item.product_photo || "https://placehold.co/300x300?text=No+Image",
            productUrl: item.product_url,
            isBestSeller: item.is_best_seller || false
        }));

    } catch (error) {
        console.error("Error:", error);
        showErrorOnScreen(error.message);
        return [];
    }
}

// UI FUNCTIONS

/**
 * Creates the New Professional "Amazon-Style" Card
 */
function createProductCard(product, index) {
    // Determine what badge to show
    let badgeHTML = '';
    if (product.originalPrice && product.price) {
        badgeHTML = `<div class="deal-badge">LIMITED DEAL</div>`;
    } else if (product.isBestSeller) {
        badgeHTML = `<div class="deal-badge" style="background:#e67a00">BEST SELLER</div>`;
    }

    const affiliateLink = getAffiliateLink(product.productUrl);
    
    return `
        <a href="${affiliateLink}" target="_blank" class="product-card fade-in stagger-${(index % 5) + 1}">
            
            <div class="product-image-container">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            </div>

            <div class="product-info">
                <h3 class="product-title" title="${product.title}">
                    ${product.title}
                </h3>
                
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <span class="product-original-price">${product.originalPrice || ''}</span>
                </div>

                <div class="product-footer">
                    <div class="platform-tag">
                        <span>🛒 Sold by <strong>${product.store}</strong></span>
                    </div>
                    <span class="buy-btn-small">GRAB DEAL</span>
                </div>
            </div>
        </a>
    `;
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!products || products.length === 0) {
        if(!grid.innerHTML.includes("ERROR")) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            if(resultsCount) resultsCount.textContent = '';
        }
        return;
    }
    
    if(noResults) noResults.style.display = 'none';
    if(resultsCount) resultsCount.textContent = `(${products.length} found)`;
    
    grid.innerHTML = products.map((product, index) => 
        createProductCard(product, index)
    ).join('');
}

function showErrorOnScreen(msg) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: #ff003c; padding: 2rem; border: 1px solid #ff003c; background: rgba(255,0,60,0.1);">
            <h3>⚠️ OOPS! ERROR DETECTED</h3>
            <p>${msg}</p>
        </div>
    `;
    hideLoading();
}

function showLoading() {
    const bar = document.getElementById('loadingBar');
    if(bar) bar.classList.add('active');
}

function hideLoading() {
    const bar = document.getElementById('loadingBar');
    if(bar) setTimeout(() => bar.classList.remove('active'), 500);
}

async function handleSearch(manualQuery = null) {
    const searchInput = document.getElementById('searchInput');
    const query = manualQuery || searchInput.value.trim();
    
    if (!query) return;
    if (manualQuery) searchInput.value = manualQuery;

    showLoading();
    document.getElementById('productsGrid').innerHTML = '';
    const noResults = document.getElementById('noResults');
    if(noResults) noResults.style.display = 'none';
    
    const results = await fetchAmazonDeals(query);
    renderProducts(results);
    hideLoading();
    
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// EVENTS
document.addEventListener('DOMContentLoaded', () => {
    console.log("System Initialized.");
    
    // Auto Search on Deal Page
    if(document.getElementById('productsGrid')) {
        handleSearch("iPhone 15");
    }

    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn) searchBtn.addEventListener('click', () => handleSearch());
    
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            handleSearch(tag.getAttribute('data-query'));
        });
    });
});
