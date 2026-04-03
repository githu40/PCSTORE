const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');
const searchItems = ['RTX 5090 ASTRAL ROG', 'RTX 4090 SUPRIMAX', 'RTX 5090 LIGHTNING Z 32GB', 'RX 9070 XT GAMING X TRIO', 'RTX 5060 MSI VENTUS', 'RTX PRO 6000 WORKSTATION BLACKWELL EDITION', 'Corsair iCUE H150i ELITE CAPELLIX AIO Cooler', 'Intel Core i9-14900K Desktop CPU', 'G.SKILL Trident Z5 RGB 64GB DDR5 6400MHz RAM Kit'];

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

        cards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const matchesQuery = !searchTerms.length || searchTerms.some(term => title.includes(term));
            const matchesCategory = cat === 'all' || card.dataset.category === cat;
            const show = matchesQuery && matchesCategory;
            card.style.display = show ? '' : 'none';
        });

        const sectionContainers = Array.from(document.querySelectorAll('.product-section'));
        sectionContainers.forEach(section => {
            const hasVisibleCard = Array.from(section.querySelectorAll('.card')).some(card => card.style.display !== 'none');
            section.style.display = hasVisibleCard ? '' : 'none';
        });
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
    'HP OMEN 45L Gaming PC': 4999.99,
    'ACER Nitro N70 Gaming PC': 4699.99,
    'RTX PRO 6000 WORKSTATION BLACKWELL EDITION': 9999.00,
    'RTX 5060 MSI VENTUS 2X OC': 499.00,
    'RX 9070 XT TUF GAMING OC': 899.00,
    'RTX 5090 LIGHTNING Z 32GB': 5090.00,
    'RTX 5090 ASTRAL ROG': 3299.99,
    'Corsair iCUE H150i ELITE CAPELLIX AIO Cooler': 219.99,
    'Intel Core i9-14900K Desktop CPU': 359.99,
    'G.SKILL Trident Z5 RGB 64GB DDR5 6400MHz RAM Kit': 329.99,
    '1TB 8x128GB Octa-Channel Workstation Memory Kit V-Color': 11999.99,
    'ASUS WS WRX90E-SAGE SE WIFI Motherboard': 899.99,
    'Corsair MP700 PRO XT 2TB M.2 (2280) PCIe Gen 5 NVMe SSD / Solid State Drive': 299.99,
    'Corsair 9000D RGB Airflow Black': 199.99,
    'Corsair iCUE LINK RX140 RGB Black Single 140mm Fan': 39.99,
    'AMD Ryzen Threadripper PRO 9995WX CPU': 6499.99,
    'AMD Ryzen 9 9950X3D 16 Core AM5 CPU': 649.99,
    'MSI MEG Aegis Ti5 Gaming PC': 5299.99,
    'Lenovo Legion T7 34IRH8 Gaming PC': 4799.99,
    'Intel Core i7-14700K Desktop CPU': 329.99,
    'AMD Ryzen 7 7800X3D Desktop CPU': 449.99,
    'ASRock X670E Taichi Motherboard': 449.99,
    'MSI MEG Z790 GODLIKE Motherboard': 599.99,
    'Gigabyte AORUS Xtreme Motherboard': 549.99,
    'ASUS ROG Crosshair X670E Hero': 499.99,
    'Corsair Vengeance RGB DDR5 64GB RAM Kit': 289.99,
    'Samsung 980 PRO 2TB NVMe SSD': 249.99,
    'Noctua NH-D15 Chromax Black Air Cooler': 109.99,
    'NZXT Kraken X73 RGB Liquid Cooler': 179.99,
    'Corsair RM1000x 1000W 80+ Gold PSU': 189.99,
    'Seasonic PRIME TX-1000 1000W 80+ Titanium PSU': 249.99,
    'EVGA SuperNOVA 850 G5 850W 80+ Gold PSU': 159.99,
    'ASUS ROG Thor 1200W 80+ Platinum PSU': 329.99,
    'Cooler Master V1200 Platinum 1200W PSU': 319.99,
    'NZXT H710i Mid Tower Case': 169.99,
    'Lian Li PC-O11 Dynamic Case': 159.99,
    'Fractal Design Meshify 2 Case': 149.99,
    'Phanteks Eclipse P500A Case': 139.99,
    'Arctic Liquid Freeze III 420mm AIO Cooler': 199.99,
    'Noctua NH-D15 Chromax Black Air Cooler': 109.99,
    'NZXT Kraken X73 RGB Liquid Cooler': 179.99,
    'Corsair Vengeance RGB DDR5 64GB RAM Kit': 289.99,
    'Samsung 980 PRO 2TB NVMe SSD': 249.99,
    'MSI MEG Z790 Tomahawk Motherboard': 399.99,
    'AORUS Xtreme Motherboard': 549.99,
    'ASUS ROG Crosshair X870E BTF Hero': 499.99,
    'MSI MEG Infinite X3 Gaming PC': 5299.99,
    'Lenovo Legion T7 34IRH8 Gaming PC': 4799.99,
    'Corsair RM1000x 1000W 80+ Gold PSU': 189.99,
    'Seasonic PRIME TX-1000 1600W 80+ Titanium PSU': 249.99,
    'EVGA SuperNOVA 850 G5 850W 80+ Gold PSU': 159.99,
    'ASUS ROG Thor 1200W 80+ Platinum PSU': 329.99,
    'Cooler Master V1200 Platinum 1200W PSU': 319.99,
    'NZXT H710i Mid Tower Case': 169.99,
    'Lian Li PC-O11 Dynamic Case': 159.99,
    'Fractal Design Meshify 2 Case': 149.99,
    'Phanteks Eclipse P500A Case': 139.99,
};
const PRODUCT_IMAGE_MAP = {
    'ACER Predator Orion 7000 PO7-660 Gaming PC': ['ORIONPREDATOR.webp','ORIONPREDATOR-2.webp','ORIONPREDATOR-3.webp'],
    'HP OMEN 45L Gaming PC': ['HPOMEN.webp','HPOMEN-2.webp','HPOMEN-3.webp','HPOMEN-4.webp'],
    'ACER Nitro N70 Gaming PC': ['NITRON70.webp','NITRON70-2.webp','NITRON70-3.webp'],
    'RTX PRO 6000 WORKSTATION BLACKWELL EDITION': ['RTX6000.webp','RTX6000-2.webp','RTX6000-3.webp', 'RTX6000-4.webp'],
    'RTX 5060 MSI VENTUS 2X OC': ['5060VENTUS.webp','5060VENTUS-2.webp','5060VENTUS-3.webp','5060VENTUS-4.webp'],
    'RX 9070 XT TUF GAMING OC': ['RX9070XT.webp','RX9070XT-2.webp','RX9070XT-3.webp','RX9070XT-4.webp'],
    'RTX 5090 LIGHTNING Z 32GB': ['5090LIGHTNINGZ.webp','5090LIGHTNINGZ-2.webp','5090LIGHTNINGZ-3.webp','5090LIGHTNINGZ-4.webp'],
    'RTX 5090 ASTRAL ROG': ['ASTRALROG5090.webp','ASTRALROG5090-2.webp','ASTRALROG5090-3.webp','ASTRALROG5090-4.webp'],
    'Corsair iCUE H150i ELITE CAPELLIX AIO Cooler': ['AIOCORSAIR.webp','AIOCORSAIR-2.webp','AIOCORSAIR-3.webp','AIOCORSAIR-4.webp'],
    'Intel Core i9-14900K Desktop CPU': ['INTELI9.webp'],
    'G.SKILL Trident Z5 RGB 64GB DDR5 6400MHz RAM Kit': ['TRIDENTRAM.webp','TRIDENTRAM-2.webp','TRIDENTRAM-3.webp','TRIDENTRAM-4.webp'],
    '1TB 8x128GB Octa-Channel Workstation Memory Kit V-Color': ['1TBRAMOCTACHANNEL.jpg'],
    'ASUS WS WRX90E-SAGE SE WIFI Motherboard': ['ASUSWRX90E.webp','ASUSWRX90E-2.webp','ASUSWRX90E-3.webp','ASUSWRX90E-4.webp'],
    'Corsair MP700 PRO XT 2TB M.2 (2280) PCIe Gen 5 NVMe SSD / Solid State Drive': ['MP700PROXT.webp','MP700PROXT-2.webp','MP700PROXT-3.webp','MP700PROXT-4.webp'],
    'Corsair 9000D RGB Airflow Black': ['9000D.webp','9000D-2.webp','9000D-3.webp','9000D-4.webp'],
    'Corsair iCUE LINK RX140 RGB Black Single 140mm Fan': ['RX140.webp','RX140-2.webp','RX140-3.webp','RX140-4.webp'],
    'AMD Ryzen Threadripper PRO 9995WX CPU': ['RYZEN9995WX.webp','RYZEN9995WX-2.webp','RYZEN9995WX-3.webp','RYZEN9995WX-4.webp'],
    'AMD Ryzen 9 9950X3D 16 Core AM5 CPU': ['RYZEN9950X3D.webp','RYZEN9950X3D-2.webp','RYZEN9950X3D-3.webp',],
    'ASRock X670E Taichi Motherboard': ['X670E.webp','X670E-2.webp','X670E-3.webp','X670E-4.webp'],
    'Intel Core i7-14700K Desktop CPU': ['INTELI7.webp',],
    'AMD Ryzen 7 7800X3D Desktop CPU': ['RYZEN7800X3D.jpg',],
    'Noctua NH-D15 Chromax Black Air Cooler': ['NOCTUAD15.webp','NOCTUAD15-2.webp','NOCTUAD15-3.webp','NOCTUAD15-4.webp'],
    'Arctic Liquid Freeze III 420mm AIO Cooler': ['ARCTIC.webp','ARCTIC-2.webp','ARCTIC-3.webp','ARCTIC-4.webp'],
    'NZXT Kraken X73 RGB Liquid Cooler': ['KRAKEN.webp','KRAKEN-2.webp','KRAKEN-3.webp','KRAKEN-4.webp'],
    'Corsair Vengeance RGB DDR5 64GB RAM Kit': ['CORSAIR64GB.webp','CORSAIR64GB-2.webp','CORSAIR64GB-3.webp'],
    'Samsung 980 PRO 2TB NVMe SSD': ['SAMSUNG2TB.webp','SAMSUNG2TB-2.webp','SAMSUNG2TB-3.webp','SAMSUNG2TB-4.webp'],
    'MSI MEG Z790 Tomahawk Motherboard': ['TOMAHAWK.webp','TOMAHAWK-2.webp','TOMAHAWK-3.webp','TOMAHAWK-4.webp'],
    'AORUS Xtreme Motherboard': ['AORUSXTREME.webp','AORUSXTREME-2.webp','AORUSXTREME-3.webp','AORUSXTREME-4.webp'],
    'ASUS ROG Crosshair X870E BTF Hero': ['ROGX870E.webp','ROGX870E-2.webp','ROGX870E-3.webp','ROGX870E-4.webp'],
    'MSI MEG Infinite X3 Gaming PC': ['MEGAEGIS.webp','MEGAEGIS-2.webp','MEGAEGIS-3.webp','MEGAEGIS-4.webp'],
    'Lenovo Legion T7 34IRH8 Gaming PC': ['LENOVOLEGION.png','LENOVOLEGION-2.png','LENOVOLEGION-3.png',],
    'Corsair RM1000x 1000W 80+ Gold PSU': ['CORSAIRPSU.webp','CORSAIRPSU-2.webp','CORSAIRPSU-3.webp','CORSAIRPSU-4.webp'],
    'Seasonic PRIME TX-1000 1600W 80+ Titanium PSU': ['PRIMEPSU.webp','PRIMEPSU-2.webp','PRIMEPSU-3.webp','PRIMEPSU-4.webp'],
    'EVGA SuperNOVA 850 G5 850W 80+ Gold PSU': ['EVGAPSU.webp','EVGAPSU-2.webp','EVGAPSU-3.webp','EVGAPSU-4.webp'],
    'ASUS ROG Thor 1200W 80+ Platinum PSU': ['ASUSPSU.webp','ASUSPSU-2.webp','ASUSPSU-3.webp','ASUSPSU-4.webp'],
    'Cooler Master V1200 Platinum 1200W PSU': ['COOLERMASTERPSU.webp','COOLERMASTERPSU-2.webp','COOLERMASTERPSU-3.webp','COOLERMASTERPSU-4.webp'],
    'NZXT H710i Mid Tower Case': ['NZXTTOWER.webp','NZXTTOWER-2.webp','NZXTTOWER-3.webp','NZXTTOWER-4.webp'],
    'Lian Li PC-O11 Dynamic Case': ['LIANLITOWER.webp','LIANLITOWER-2.webp','LIANLITOWER-3.webp','LIANLITOWER-4.webp'],
    'Fractal Design Meshify 2 Case': ['FRACTALTOWER.webp','FRACTALTOWER-2.webp','FRACTALTOWER-3.webp','FRACTALTOWER-4.webp'],
    'Phanteks Eclipse P500A Case': ['PHANTEKSTOWER.webp','PHANTEKSTOWER-2.webp','PHANTEKSTOWER-3.webp','PHANTEKSTOWER-4.webp'],


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

function attachCheckoutButton() {
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton && !checkoutButton.dataset.checkoutAttached) {
        checkoutButton.dataset.checkoutAttached = 'true';
        checkoutButton.addEventListener('click', () => {
            // Clear the cart
            cart = [];
            saveCart();
            updateUI();
            // Redirect to thank you page
            window.location.href = 'thanks.html';
        });
    }
}

function initPage() {
    loadCart();
    createProductModal();
    updateUI();
    attachBuyButtons();
    attachCheckoutButton();
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