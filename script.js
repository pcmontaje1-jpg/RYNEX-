// ===== PRODUCT DATA =====
const components = [
    { id: 1, name: 'NVIDIA RTX 4070 Super', category: 'GPU', icon: '🎮', specs: '12GB GDDR6X', price: 599 },
    { id: 2, name: 'AMD Ryzen 7 7800X3D', category: 'CPU', icon: '⚡', specs: '8 cores, 5.0 GHz', price: 449 },
    { id: 3, name: 'ASUS ROG Strix B650E', category: 'Motherboard', icon: '🔲', specs: 'AM5, WiFi 6E', price: 229 },
    { id: 4, name: 'Corsair Vengeance 32GB', category: 'RAM', icon: '🧠', specs: 'DDR5 6000MHz', price: 129 },
    { id: 5, name: 'Samsung 990 Pro 2TB', category: 'SSD', icon: '💾', specs: 'NVMe M.2, 7450 MB/s', price: 189 },
    { id: 6, name: 'Corsair RM850x', category: 'PSU', icon: '🔌', specs: '850W, 80+ Gold', price: 139 },
    { id: 7, name: 'NZXT Kraken 240', category: 'Cooler', icon: '❄️', specs: '240mm AIO', price: 129 },
    { id: 8, name: 'Lian Li O11 Dynamic', category: 'Case', icon: '🖥️', specs: 'ATX, Tempered Glass', price: 149 },
];

const prebuiltPCs = [
    { id: 101, name: 'Gaming Beast X', icon: '🚀', specs: 'RTX 4080, i9-13900K, 32GB DDR5', price: 2199 },
    { id: 102, name: 'Workstation Pro', icon: '💼', specs: 'RTX 4070 Ti, Ryzen 9, 64GB DDR5', price: 1899 },
    { id: 103, name: 'Budget Gamer', icon: '🎯', specs: 'RTX 4060, Ryzen 5, 16GB DDR4', price: 799 },
    { id: 104, name: 'Mini ITX Build', icon: '📦', specs: 'RTX 4060 Ti, i5-13600K, 16GB', price: 1299 },
];

// ===== CART STATE =====
let cart = [];

// ===== DOM ELEMENTS =====
const componentsGrid = document.getElementById('componentsGrid');
const prebuiltGrid = document.getElementById('prebuiltGrid');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const cartOverlay = document.getElementById('cartOverlay');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const successOverlay = document.getElementById('successOverlay');
const navLinks = document.getElementById('navLinks');

// ===== RENDER PRODUCTS =====
function renderComponents() {
    componentsGrid.innerHTML = components.map(product => `
        <div class="product-card">
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-specs">${product.category} · ${product.specs}</div>
            <div class="product-price">€${product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}, 'component')">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

function renderPrebuilt() {
    prebuiltGrid.innerHTML = prebuiltPCs.map(pc => `
        <div class="product-card">
            <div class="product-icon">${pc.icon}</div>
            <div class="product-name">${pc.name}</div>
            <div class="product-specs">${pc.specs}</div>
            <div class="product-price">€${pc.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${pc.id}, 'prebuilt')">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

// ===== CART FUNCTIONS =====
function addToCart(id, type) {
    const item = type === 'component' 
        ? components.find(c => c.id === id)
        : prebuiltPCs.find(p => p.id === id);
    if (!item) return;
    
    const existing = cart.find(c => c.id === id && c.type === type);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, type, quantity: 1 });
    }
    updateCartUI();
    // Показываем мини-анимацию или просто обновляем бейдж
    cartBadge.style.animation = 'none';
    setTimeout(() => cartBadge.style.animation = 'badgePulse 2s infinite', 10);
}

function removeFromCart(id, type) {
    cart = cart.filter(c => !(c.id === id && c.type === type));
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name} × ${item.quantity}</div>
                        <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.type}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `Total: €${total.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `Total: €${total.toFixed(2)}`;
}

// ===== MODAL CONTROLS =====
function toggleCart() {
    if (checkoutOverlay.classList.contains('open')) closeCheckout();
    cartOverlay.classList.toggle('open');
    if (cartOverlay.classList.contains('open')) {
        updateCartUI();
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items first.');
        return;
    }
    cartOverlay.classList.remove('open');
    checkoutOverlay.classList.add('open');
    updateCartUI();
}

function closeCheckout() {
    checkoutOverlay.classList.remove('open');
}

function closeSuccess() {
    successOverlay.classList.remove('open');
}

// ===== PAYMENT METHOD SELECTION =====
function selectPayment(method) {
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    if (method === 'mono') {
        document.getElementById('monoBankOption').classList.add('active');
        document.getElementById('monoBankFields').style.display = 'block';
        document.getElementById('cardFields').style.display = 'none';
        document.getElementById('paypalFields').style.display = 'none';
    } else if (method === 'visa') {
        document.getElementById('visaOption').classList.add('active');
        document.getElementById('monoBankFields').style.display = 'none';
        document.getElementById('cardFields').style.display = 'block';
        document.getElementById('paypalFields').style.display = 'none';
    } else if (method === 'paypal') {
        document.getElementById('paypalOption').classList.add('active');
        document.getElementById('monoBankFields').style.display = 'none';
        document.getElementById('cardFields').style.display = 'none';
        document.getElementById('paypalFields').style.display = 'block';
    }
}

// ===== CHECKOUT =====
function placeOrder() {
    // Здесь будет реальная оплата через Stripe/PayPal/MonoBank.
    // Пока просто имитируем успешное завершение.
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    if (!name || !email) {
        alert('Please fill in your name and email.');
        return;
    }
    
    // Симуляция успеха
    checkoutOverlay.classList.remove('open');
    successOverlay.classList.add('open');
    
    // Очищаем корзину после "оплаты"
    cart = [];
    updateCartUI();
}

// ===== CONTACT FORM =====
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    navLinks.classList.toggle('open');
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== NAV LINK ACTIVE STATE =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('open');
        }
    });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    renderComponents();
    renderPrebuilt();
    updateCartUI();
});
