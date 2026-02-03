/**
 * DEAL HUNTER - Final Version
 * Includes Error Reporting and Hardcoded Key
 */

// ============================================
// 🔑 API CONFIGURATION (Teri Key Daal Di Hai)
// ============================================

const RAPID_API_KEY = 'f273bac7c8msh2aa7a560484e824p115ce5jsn1087c9cd67e0'; 
const RAPID_API_HOST = 'real-time-amazon-data.p.rapidapi.com';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatPrice(price) {
    if (!price) return 'Check Site';
    return price;
}

function getAffiliateLink(url) {
    const myTag = 'arnavdeals-21'; 
    if (!url) return '#';
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
    // Console mein check kar ki search shuru hua
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
        console.log("Response Status:", response.status); // Debugging

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} (Check Quota or Key)`);
        }

        const data = await response.json();
        console.log("API Data:", data); // Debugging

        // Data structure check
        let products = [];
        if (data.data && data.data.products) {
            products = data.data.products;
        } else if (data.products) {
            products = data.products;
        }

        return products.map((item, index) => ({
            id: item.asin || index,
            title: item.product_title || "No Title",
            price: item.product_price || "Check Price",
            originalPrice: item.product_original_price,
            store: "Amazon",
            storeClass: "amazon",
            image: item.product_photo || "https://placehold.co/300x300?text=No+Image",
            productUrl: item.product_url,
            badge: item.is_best_seller ? "Best Seller" : (item.is_amazon_choice ? "Amazon's Choice" : null)
        }));

    } catch (error) {
        console.error("Critical Error:", error);
        // Error screen par dikhao
        showErrorOnScreen(error.message);
        return [];
    }
}

// ============================================
// UI FUNCTIONS
// ============================================

function showErrorOnScreen(msg) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: #ff003c; padding: 2rem; border: 1px solid #ff003c; background: rgba(255,0,60,0.1);">
            <h3>⚠️ OOPS! ERROR DETECTED</h3>
            <p>${msg}</p>
            <p style="font-size: 0.8rem; color: #aaa;">Try refreshing the page or checking your internet.</p>
        </div>
    `;
    document.getElementById('loadingBar').classList.remove('active');
}

function createProductCard(product, index) {
    const badgeHTML = product.badge 
        ? `<span class="product-badge">${product.badge}</span>` 
        : '';
    
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
                        <span class="product-price">${formatPrice(product.price)}</span>
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

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!products || products.length === 0) {
        // Agar error nahi hai par products 0 hain
        if(!grid.innerHTML.includes("ERROR")) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            resultsCount.textContent = '';
        }
        return;
    }
    
    noResults.style.display = 'none';
    resultsCount.textContent = `(${products.length} found)`;
    
    grid.innerHTML = products.map((product, index) => 
        createProductCard(product, index)
    ).join('');
}

function showLoading() {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.classList.add('active');
    // Ensure loading bar is visible
    loadingBar.style.display = 'block';
}

function hideLoading() {
    const loadingBar = document.getElementById('loadingBar');
    setTimeout(() => {
        loadingBar.classList.remove('active');
        loadingBar.style.display = 'none';
    }, 500);
}

async function handleSearch(manualQuery = null) {
    const searchInput = document.getElementById('searchInput');
    // Agar manual query mili (jaise auto-load par) toh wo use karo, nahi toh input box
    const query = manualQuery || searchInput.value.trim();
    
    if (!query) return;

    // Update input box if manual query was used
    if (manualQuery) searchInput.value = manualQuery;

    showLoading();
    document.getElementById('productsGrid').innerHTML = ''; // Clear previous
    document.getElementById('noResults').style.display = 'none';
    
    const results = await fetchAmazonDeals(query);
    
    renderProducts(results);
    hideLoading();
    
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 🚀 AUTO SEARCH ON LOAD (Taaki khali na dikhe)
    console.log("System Initialized. Auto-searching...");
    handleSearch("iPhone 15");

    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', () => handleSearch());
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.getAttribute('data-query');
            handleSearch(query);
        });
    });
});

console.log('%c DEAL HUNTER ONLINE ', 'background: #00ff41; color: #000; font-weight: bold;');
