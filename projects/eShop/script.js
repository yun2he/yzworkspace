// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    addQuantityControlListeners();
    addToCartListeners();
});

let cart = [];
// Sample product data
const products = [
    { id: 1, name: 'Product 1', price: 19.99, image: 'assets/item1.jpg' },
    { id: 2, name: 'Product 2', price: 29.99, image: 'assets/item2.jpg' },
    { id: 3, name: 'Product 3', price: 39.99, image: 'assets/item3.jpg' },
    // Add more products as needed
];

// Function to render products
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <div class="quantity-control">
                <button class="quantity-btn minus" data-id="${product.id}">-</button>
                <span class="quantity" data-id="${product.id}">1</span>
                <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
            <button class="add-to-cart" data-id="${product.id}">
                <span class="button-text">Add to Cart</span>
                <span class="adding-text">Adding...</span>
            </button>
        `;
        productGrid.appendChild(productElement);
    });

    addQuantityControlListeners();
    addToCartListeners();
}

function addQuantityControlListeners() {
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');

    minusButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
}

function addToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
}

function increaseQuantity(event) {
    const productId = event.target.dataset.id;
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
}

// Function to add item to cart (placeholder)
function addToCart(event) {
    const button = event.target.closest('.add-to-cart');
    const productId = parseInt(button.dataset.id);
    const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
    const quantity = parseInt(quantityElement.textContent);
    
    const product = products.find(p => p.id === productId);
    
    // Click effect
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 300);

    // Adding effect
    button.classList.add('adding');
    setTimeout(() => {
        button.classList.remove('adding');
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        
        updateCartCount();
        saveCart();
        console.log(`Added ${quantity} of product ${productId} to cart`);
    }, 1000);
}

// Function to update cart count (placeholder)
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Navigation menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const navButton = document.querySelector('.nav-button');
    const sideNav = document.querySelector('.side-nav');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');

    function openNav() {
        sideNav.style.width = '250px';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        sideNav.style.width = '0';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    navButton.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    // Close the nav menu if the window is resized past mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeNav();
        }
    });

    loadCart();
    renderProducts();
    addQuantityControlListeners();
    addToCartListeners();
});

document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('promo-banner');
    const closeButton = banner.querySelector('.close-banner');

    closeButton.addEventListener('click', function() {
        banner.style.display = 'none';
        // If you want the header to adjust when the banner is closed:
        document.querySelector('header').style.top = '0';
    });

    const bannerHeight = banner.offsetHeight;
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > bannerHeight) {
            // Scrolling down & past the banner
            banner.style.transform = `translateY(-${bannerHeight}px)`;
            header.style.top = '0';
        } else if (scrollTop <= bannerHeight) {
            // Scrolled back to the top
            banner.style.transform = 'translateY(0)';
            header.style.top = `${bannerHeight}px`;
        }
        
        lastScrollTop = scrollTop;
    });

    // Handle banner close button if it exists
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            banner.style.display = 'none';
            header.style.top = '0';
            // Adjust scroll behavior after banner is closed
            bannerHeight = 0;
        });
    }
});
