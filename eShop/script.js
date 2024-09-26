// Updated product data to include sold count
const products = [
    { id: 1, name: "Product 1", price: 19.99, images: ["products/1 (1).png"], soldCount: 10 },
    { id: 2, name: "Product 2", price: 29.99, images: ["products/2 (1).png"], soldCount: 15 },
    { id: 3, name: "Product 3", price: 39.99, images: ["products/3 (1).png"], soldCount: 8 },
    { id: 4, name: "Product 4", price: 49.99, images: Array.from({length: 10}, (_, i) => `products/4 (${i+1}).png`), soldCount: 20 },
    { id: 5, name: "Product 5", price: 59.99, images: Array.from({length: 10}, (_, i) => `products/5 (${i+1}).png`), soldCount: 12 },
    { id: 6, name: "Product 6", price: 69.99, images: Array.from({length: 10}, (_, i) => `products/6 (${i+1}).png`), soldCount: 5 },
];

// Function to create product items
function createProductItem(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-item');
    
    const imageGallery = product.images.map((img, index) => `
        <img src="${img}" alt="${product.name} - Image ${index + 1}" class="product-image ${index === 0 ? 'active' : ''}">
    `).join('');

    productDiv.innerHTML = `
        <div class="product-gallery">
            ${imageGallery}
            <button class="gallery-arrow left" onclick="changeImage(${product.id}, 'prev')">&lt;</button>
            <button class="gallery-arrow right" onclick="changeImage(${product.id}, 'next')">&gt;</button>
        </div>
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <p class="sold-count" onclick="makeEditable(this)" data-product-id="${product.id}">Items Sold: ${product.soldCount}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    
    if (window.innerWidth <= 480) {
        handleTouchEvents(product.id);
    }

    return productDiv;
}

// Function to handle touch events for swiping
function handleTouchEvents(productId) {
    const productElement = document.querySelector(`.product-item:nth-child(${productId})`);
    const gallery = productElement.querySelector('.product-gallery');
    let startX, moveX;

    gallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    gallery.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX;
    });

    gallery.addEventListener('touchend', () => {
        if (startX + 50 < moveX) {
            changeImage(productId, 'prev');
        } else if (startX - 50 > moveX) {
            changeImage(productId, 'next');
        }
    });
}

// Function to display products
function displayProducts() {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = ''; // Clear existing products
    products.forEach(product => {
        const productItem = createProductItem(product);
        productList.appendChild(productItem);
    });
}

// Updated function to change the displayed image
function changeImage(productId, direction) {
    const productElement = document.querySelector(`.product-item:nth-child(${productId})`);
    const images = productElement.querySelectorAll('.product-image');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    
    images[currentIndex].classList.remove('active');
    
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % images.length;
    } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    images[currentIndex].classList.add('active');
}

// Function to add item to cart (to be implemented later)
function addToCart(productId) {
    console.log(`Product ${productId} added to cart`);
    // We'll implement this functionality in a future step
}

// Call displayProducts when the page loads and when the window is resized
window.addEventListener('load', displayProducts);
window.addEventListener('resize', displayProducts);
