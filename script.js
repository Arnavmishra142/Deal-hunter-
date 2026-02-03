/**
 * DEAL HUNTER - JavaScript Logic
 * Mock data search functionality with cyberpunk UI interactions
 */

// ============================================
// MOCK PRODUCT DATABASE
// ============================================

const mockProducts = [
    {
        id: 1,
        title: "Apple iPhone 15 Pro Max 256GB - Natural Titanium",
        price: 159900,
        originalPrice: 169900,
        discount: "6%",
        store: "Amazon",
        storeClass: "amazon",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=300&fit=crop",
        badge: "Best Seller"
    },
    {
        id: 2,
        title: "Samsung Galaxy S24 Ultra 5G 256GB - Titanium Gray",
        price: 129999,
        originalPrice: 144999,
        discount: "10%",
        store: "Flipkart",
        storeClass: "flipkart",
        image: "https://images.unsplash.com/photo-1610945265078-3858a0828671?w=400&h=300&fit=crop",
        badge: "Hot Deal"
    },
    {
        id: 3,
        title: "MacBook Air M3 13-inch 8GB RAM 256GB SSD - Midnight",
        price: 114900,
        originalPrice: 124900,
        discount: "8%",
        store: "Amazon",
        storeClass: "amazon",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        badge: "Trending"
    },
    {
        id: 4,
        title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        price: 29990,
        originalPrice: 34990,
        discount: "14%",
        store: "Flipkart",
        storeClass: "flipkart",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop",
        badge: null
    },
    {
        id: 5,
        title: "Apple Watch Series 9 GPS 45mm - Midnight Aluminum",
        price: 41900,
        originalPrice: 45900,
        discount: "9%",
        store: "Amazon",
        storeClass: "amazon",
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop",
        badge: "New"
    },
    {
        id: 6,
        title: "Dell XPS 15 Laptop - Intel Core i7, 16GB RAM, 512GB SSD",
        price: 189990,
        originalPrice: 219990,
        discount: "14%",
        store: "Flipkart",
        storeClass: "flipkart",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=400&h=300&fit=crop",
        badge: null
    },
    {
        id: 7,
        title: "AirPods Pro 2nd Generation with MagSafe Case",
        price: 24900,
        originalPrice: 26900,
        discount: "7%",
        store: "Amazon",
        storeClass: "amazon",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
        badge: "Popular"
    },
    {
        id: 8,
        title: "iPad Pro 12.9-inch M2 Chip 256GB WiFi - Space Gray",
        price: 112900,
        originalPrice: 122900,
        discount: "8%",
        store: "Flipkart",
        storeClass: "flipkart",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        badge: null
    },
    {
        id: 9,
        title: "OnePlus 12 5G 256GB - Flowy Emerald",
        price: 64999,
        originalPrice: 69999,
        discount: "7%",
        store: "Amazon",
        storeClass: "amazon",
        image: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=400&h=300&fit=crop",
        badge: "Flash Sale"
    },
    {
        id: 10,
        title: "Samsung Galaxy Watch 6 Classic 47mm Bluetooth",
        price: 29999,
        originalPrice: 37999,
        discount: "21%",
        store: "Flipkart",
        storeClass: "flipkart",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=300&fit=crop",
        badge: "Best Deal"
    },
    {
        id: 11,
        title: "JBL Tune 760NC Wireless Over-Ear Headphones",
        price: 5999,
        originalPrice: 8999,
        discount: "33%",
        store: "Amazon",
        storeClass: "amazon",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
        badge: null
    },
    {
        id: 12,
        title: "HP Pavilion Gaming Laptop - Ryzen 5, RTX 3050, 16GB RAM",
        price: 72999,
        originalPrice: 89999,
        discount: "19%",
        store: "Flipkart",
        storeClass: "flipkart",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
        badge: "Gaming"
    }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format price in Indian Rupees
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Get random products from the mock database
 */
function getRandomProducts(count = 5) {
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Filter products based on search query
 */
function filterProducts(query) {
    if (!query || query.trim() === '') {
        return getRandomProducts(5);
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = mockProducts.filter(product => 
        product.title.toLowerCase().includes(lowerQuery) ||
        product.store.toLowerCase().includes(lowerQuery)
    );
    
    // If no exact matches, return random products
    if (filtered.length === 0) {
        return getRandomProducts(5);
    }
    
    return filtered.slice(0, 6);
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
    
    const originalPriceHTML = product.originalPrice 
        ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>` 
        : '';
    
    const discountHTML = product.discount 
        ? `<span class="discount-badge">-${product.discount}</span>` 
        : '';
    
    return `
        <div class="product-card fade-in stagger-${(index % 5) + 1}" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                ${badgeHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price-row">
                    <div>
                        <span class="product-price">
                            <span class="price-currency">₹</span>${product.price.toLocaleString('en-IN')}
                        </span>
                        ${originalPriceHTML}
                    </div>
                    ${discountHTML}
                </div>
                <div class="store-info">
                    <span class="store-label">Sold by:</span>
                    <span class="store-name ${product.storeClass}">${product.store}</span>
                </div>
                <button class="buy-btn" onclick="handleBuyNow(${product.id})">
                    Buy Now
                </button>
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
    
    if (products.length === 0) {
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
    }, 1000);
}

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    showLoading();
    
    // Simulate network delay for realism
    setTimeout(() => {
        const results = filterProducts(query);
        renderProducts(results);
        hideLoading();
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 600);
}

/**
 * Handle Buy Now button click
 */
function handleBuyNow(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        // Create a cyberpunk-style alert
        showCyberAlert(`Redirecting to ${product.store} for: ${product.title}`);
    }
}

/**
 * Show cyberpunk styled alert
 */
function showCyberAlert(message) {
    // Remove existing alert if any
    const existingAlert = document.querySelector('.cyber-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'cyber-alert';
    alert.innerHTML = `
        <div class="cyber-alert-content">
            <span class="cyber-alert-icon">◈</span>
            <span class="cyber-alert-text">${message}</span>
        </div>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 65, 0.1);
        border: 1px solid #00ff41;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .cyber-alert-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-family: 'Rajdhani', sans-serif;
        }
        .cyber-alert-icon {
            color: #00ff41;
            font-size: 1.5rem;
        }
        .cyber-alert-text {
            color: #fff;
            font-size: 0.95rem;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

/**
 * Create floating particles
 */
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${10 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Create floating particles
    createParticles();
    
    // Search button click
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);
    
    // Search on Enter key
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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
    
    // Add input focus effect
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-container').classList.add('focused');
    });
    
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-container').classList.remove('focused');
    });
    
    // Initial load - show some random products
    setTimeout(() => {
        const initialProducts = getRandomProducts(4);
        renderProducts(initialProducts);
    }, 500);
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value) {
            searchInput.value = '';
            searchInput.blur();
        }
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c DEAL HUNTER v2.0.77 ', 'background: #00ff41; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c SYSTEM ONLINE ', 'color: #00ffff; font-size: 14px;');
console.log('%c > Press Ctrl+K to focus search ', 'color: #888; font-size: 12px;');
console.log('%c > Press Escape to clear search ', 'color: #888; font-size: 12px;');
                                 
