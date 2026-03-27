const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');
const searchItems = ['RTX 5090 ASTRAL ROG', 'RTX 4090 SUPRIMAX', 'RTX 5090 LIGHTNING Z 32GB', 'RX 9070 XT GAMING X TRIO', 'RTX 5060 MSI VENTUS', 'RTX PRO 6000 WORKSTATION BLACKWELL EDITION',];

// Suggestions dropdown
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    suggestionsBox.innerHTML = '';
    if (query.length < 1) {
        suggestionsBox.style.display = 'none';
        return;
    }
    const filtered = searchItems.filter(item => item.toLowerCase().startsWith(query));
    const limitedFiltered = filtered.slice(0, 3);
    if (limitedFiltered.length > 0) {
        suggestionsBox.style.display = 'block';
        limitedFiltered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = item;
            div.onclick = () => {
                searchInput.value = item;
                suggestionsBox.style.display = 'none';
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = 'none';
    }
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => suggestionsBox.style.display = 'none', 200);
});

if (window.location.pathname.includes('catalog.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const category = urlParams.get('category') || 'all';

    const categoryButtons = Array.from(document.querySelectorAll('.category-button'));
    const categoryInput = document.getElementById('categoryInput');
    const allCards = Array.from(document.querySelectorAll('.card'));

    const setActiveCategory = (cat) => {
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === cat);
        });
        if (categoryInput) categoryInput.value = cat;
    };

    const buildQueryString = (q, cat) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (cat && cat !== 'all') params.set('category', cat);
        return params.toString();
    };

    const filterAndRender = (q, cat) => {
        const cards = allCards;
        const queryLower = q.toLowerCase();

        const searchTerms = queryLower
            .split(/\s+/)
            .map(t => t.trim())
            .filter(Boolean);

        const filtered = cards
            .filter(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const matchesQuery = !searchTerms.length || searchTerms.some(term => title.includes(term));
                const matchesCategory = cat === 'all' || card.dataset.category === cat;
                return matchesQuery && matchesCategory;
            })
            .sort((a, b) => {
                const titleA = a.querySelector('h2').textContent.toLowerCase();
                const titleB = b.querySelector('h2').textContent.toLowerCase();
                const exactA = titleA === queryLower;
                const exactB = titleB === queryLower;
                if (exactA && !exactB) return -1;
                if (!exactA && exactB) return 1;

                const startsA = titleA.startsWith(queryLower);
                const startsB = titleB.startsWith(queryLower);
                if (startsA && !startsB) return -1;
                if (!startsA && startsB) return 1;

                const indexA = titleA.indexOf(queryLower);
                const indexB = titleB.indexOf(queryLower);
                return indexA - indexB;
            });

        const cardsContainer = document.querySelector('.cards');
        cardsContainer.innerHTML = '';
        filtered.forEach(card => cardsContainer.appendChild(card));
    };

    searchInput.value = query;
    setActiveCategory(category);
    filterAndRender(query, category);

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.dataset.category;
            setActiveCategory(selected);
            filterAndRender(searchInput.value, selected);
            const newQuery = buildQueryString(searchInput.value, selected);
            const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
            window.history.replaceState({}, '', newUrl);
        });
    });
} else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // On home page, keep cards visible regardless of search input.
    // The search bar still submits to catalog.html when the user hits Enter.
}
const CART_STORAGE_KEY = 'pcstore_cart';
const PRODUCT_PRICE_MAP = {
    'ACER Predator Orion 7000 PO7-660 Gaming PC': 5299.99,
    'Laptop': 2499.00,
    'Desktop PC': 2199.00,
    'RTX PRO 6000 WORKSTATION BLACKWELL EDITION': 9999.00,
    'RTX 5060 MSI VENTUS': 499.00,
    'RX 9070 XT GAMING X TRIO': 899.00,
    'RTX 5090 LIGHTNING Z 32GB': 12999.00,
    'RTX 4090 SUPRIMAX': 2499.00,
    'RTX 5090 ASTRAL ROG': 11999.00,
};
const PRODUCT_IMAGE_MAP = {
    'ACER Predator Orion 7000 PO7-660 Gaming PC': ['ORIONPREDATOR.webp','ORIONPREDATOR-2.webp','ORIONPREDATOR-3.webp'],
    'Laptop': ['ORIONPREDATOR.webp','ORIONPREDATOR-2.webp'],
    'Desktop PC': ['ORIONPREDATOR.webp','ORIONPREDATOR-3.webp'],
    'RTX PRO 6000 WORKSTATION BLACKWELL EDITION': ['RTX6000.webp','RTX6000-2.webp','RTX6000-3.webp', 'RTX6000-4.webp'],
    'RTX 5060 MSI VENTUS': ['RTXX5060.webp','RTXX5060-2.webp'],
    'RX 9070 XT GAMING X TRIO': ['RXX9070XT.webp','RXX9070XT-2.webp'],
    'RTX 5090 LIGHTNING Z 32GB': ['RTXX5090LIGHTNINGZ32GB.webp','RTXX5090LIGHTNINGZ32GB-2.webp'],
    'RTX 4090 SUPRIMAX': ['RTXX4090SUPRIMAX.webp','RTXX4090SUPRIMAX-2.webp'],
    'RTX 5090 ASTRAL ROG': ['ASTRALROG5090.webp','ASTRALROG5090-2.webp'],
};

let cart = [];
let total = 0;
let activeProduct = null;
let productModalImages = [];
let activeProductImageIndex = 0;

function loadCart() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    cart = stored ? JSON.parse(stored) : [];
    total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatCurrency(value) {
    return Number(value || 0).toFixed(2);
}

function normalizeImagePath(path) {
    return path ? encodeURI(path) : '';
}

function getCartQuantity() {
    return cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
}

function updateCartCount() {
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = getCartQuantity();
    });
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';

    if (!cart.length) {
        const empty = document.createElement('p');
        empty.textContent = 'Your basket is empty.';
        empty.className = 'empty-cart-message';
        cartItems.appendChild(empty);
        return;
    }

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item-card';

        li.innerHTML = `
            <div class="cart-item-card-image">
                <img src="${item.image || ''}" alt="${item.name}">
            </div>
            <div class="cart-item-card-body">
                <h3>${item.name}</h3>
                <p>${item.shortDescription || item.description || 'No description available.'}</p>
                <div class="cart-item-meta">
                    <span>Qty: ${item.quantity}</span>
                    <span>Price: $${formatCurrency(item.price)}</span>
                    <span>Subtotal: $${formatCurrency(item.price * item.quantity)}</span>
                </div>
            </div>`;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-item';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeFromCart(index));
        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });
}

function updateUI() {
    updateCartCount();
    renderCartItems();

    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) {
        totalPriceEl.textContent = formatCurrency(total);
    }

    const cartTotalSpan = document.getElementById('cart-total');
    if (cartTotalSpan) {
        cartTotalSpan.textContent = formatCurrency(total);
    }
}

function addToCart(product, quantity = 1) {
    const qty = Math.max(1, Number(quantity) || 1);
    const name = typeof product === 'string' ? product : product.name;
    const price = Number(product.price || 0);
    const image = product.image || '';
    const description = product.description || 'No additional details available.';
    const shortDescription = product.shortDescription || (description.length > 100 ? description.slice(0, 100).trim() + '...' : description);

    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity = Number(existing.quantity || 1) + qty;
    } else {
        cart.push({
            name,
            price,
            volume: qty,
            quantity: qty,
            image,
            description,
            shortDescription,
        });
    }

    total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
    saveCart();
    updateUI();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
    saveCart();
    updateUI();
}

function getProductPrice(card, button) {
    const rawPrice = Number(button.dataset.price || card?.dataset.price || 0);
    if (rawPrice > 0) return rawPrice;
    const title = card?.querySelector('h2')?.innerText.trim();
    return PRODUCT_PRICE_MAP[title] || 0;
}

function setModalMainImage(index) {
    activeProductImageIndex = index;
    const modal = document.getElementById('productModal');
    if (!modal) return;
    const mainImg = modal.querySelector('.product-modal-image img');
    const thumbs = modal.querySelectorAll('.product-thumbnail');
    const imageUrl = productModalImages[index] || productModalImages[0] || '';
    if (mainImg) {
        mainImg.src = normalizeImagePath(imageUrl);
        mainImg.alt = activeProduct?.name || 'Product image';
    }
    thumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
}

function renderProductThumbnails(images) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    const thumbsContainer = modal.querySelector('#productImageThumbs');
    if (!thumbsContainer) return;
    thumbsContainer.innerHTML = '';
    images.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = normalizeImagePath(src);
        thumb.alt = `${activeProduct?.name || 'Product'} image ${idx + 1}`;
        thumb.className = 'product-thumbnail';
        thumb.addEventListener('click', () => setModalMainImage(idx));
        thumbsContainer.appendChild(thumb);
    });
}

function createProductModal() {
    if (document.getElementById('productModal')) return;

    const modalHtml = `
        <div id="productModal" class="product-modal hidden">
            <div class="product-modal-card">
                <button type="button" class="modal-close" aria-label="Close">&times;</button>
                <div class="product-modal-grid">
                    <div class="product-modal-image">
                        <button type="button" class="image-nav-button prev" aria-label="Previous image">&lsaquo;</button>
                        <img src="" alt="Product image">
                        <button type="button" class="image-nav-button next" aria-label="Next image">&rsaquo;</button>
                    </div>
                    <div class="product-modal-info">
                        <h2 id="productModalName">Product</h2>
                        <p id="productModalFullDescription"></p>
                        <p class="product-modal-price">Price: $<span id="productModalPrice">0.00</span></p>
                        <label class="product-modal-quantity-label">
                            Quantity
                            <input id="productQuantity" type="number" min="1" value="1">
                        </label>
                        <p class="product-modal-total">Total: $<span id="productModalTotal">0.00</span></p>
                        <button id="productBuyButton" type="button" class="checkout-button">Buy</button>
                    </div>
                </div>
                <div id="productImageThumbs" class="product-image-thumbs"></div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('productModal');
    const closeButton = modal.querySelector('.modal-close');
    const quantityInput = modal.querySelector('#productQuantity');
    const buyButton = modal.querySelector('#productBuyButton');
    const prevButton = modal.querySelector('.image-nav-button.prev');
    const nextButton = modal.querySelector('.image-nav-button.next');

    closeButton.addEventListener('click', closeProductModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeProductModal();
    });

    prevButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!productModalImages.length) return;
        const prevIndex = (activeProductImageIndex - 1 + productModalImages.length) % productModalImages.length;
        setModalMainImage(prevIndex);
    });

    nextButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!productModalImages.length) return;
        const nextIndex = (activeProductImageIndex + 1) % productModalImages.length;
        setModalMainImage(nextIndex);
    });

    quantityInput.addEventListener('input', updateModalTotal);
    buyButton.addEventListener('click', () => {
        if (!activeProduct) return;
        addToCart(activeProduct, quantityInput.value);
        closeProductModal();
    });
}

function openProductModal(product) {
    if (!document.getElementById('productModal')) createProductModal();
    activeProduct = product;

    const modal = document.getElementById('productModal');
    const image = modal.querySelector('.product-modal-image img');
    const name = modal.querySelector('#productModalName');
    const description = modal.querySelector('#productModalFullDescription');
    const price = modal.querySelector('#productModalPrice');
    const quantityInput = modal.querySelector('#productQuantity');

    productModalImages = (product.images && product.images.length) ? product.images : (PRODUCT_IMAGE_MAP[product.name] || [product.image || '']);
    if (!productModalImages.length) {
        productModalImages = [product.image || ''];
    }
    renderProductThumbnails(productModalImages);
    setModalMainImage(0);
    name.textContent = product.name || 'Product';
    description.textContent = product.description || 'No additional details available.';
    price.textContent = formatCurrency(product.price);
    quantityInput.value = 1;
    updateModalTotal();
    modal.classList.remove('hidden');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.classList.add('hidden');
    activeProduct = null;
}

function updateModalTotal() {
    const modal = document.getElementById('productModal');
    if (!modal || !activeProduct) return;
    const quantityInput = modal.querySelector('#productQuantity');
    const totalOutput = modal.querySelector('#productModalTotal');
    const quantity = Math.max(1, Number(quantityInput.value) || 1);
    totalOutput.textContent = formatCurrency(activeProduct.price * quantity);
}

function handleBuyButtonClick(button) {
    const card = button.closest('.card');
    const name = card?.querySelector('h2')?.innerText.trim() || 'Product';
    const price = getProductPrice(card, button);
    const image = card?.querySelector('img')?.getAttribute('src') || '';
    const description = card?.querySelector('p')?.innerText.trim() || '';
    const shortDescription = description.length > 100 ? description.slice(0, 100).trim() + '...' : description;
    const images = PRODUCT_IMAGE_MAP[name] || [image];

    openProductModal({
        name,
        price,
        image,
        images,
        description,
        shortDescription,
    });
}

function attachBuyButtons() {
    document.querySelectorAll('.card-button').forEach(button => {
        if (button.dataset.buyAttached) return;
        button.dataset.buyAttached = 'true';

        button.addEventListener('click', event => {
            event.preventDefault();
            handleBuyButtonClick(button);
        });
    });
}

function initPage() {
    loadCart();
    createProductModal();
    updateUI();
    attachBuyButtons();
}

if (document.readyState !== 'loading') {
    initPage();
} else {
    window.addEventListener('DOMContentLoaded', initPage);
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}