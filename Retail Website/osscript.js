// Product data (you can replace this with actual data from a database)
const products = [
    { 
        id: 1, 
        name: "Product 1", 
        description: "Description of Product 1", 
        price: 19.99, 
        images: ["products/1(1).png", "", ""] // Space for two more images in the future
    },
    { 
        id: 2, 
        name: "Product 2", 
        description: "Description of Product 2", 
        price: 29.99, 
        images: ["products/2(1).png", "", ""] // Space for two more images in the future
    },
    { 
        id: 3, 
        name: "Product 3", 
        description: "Description of Product 3", 
        price: 39.99, 
        images: ["products/3(1).png", "", ""] // Space for two more images in the future
    }
];

// Function to generate product HTML
function generateProductHTML(product) {
    return `
        <div class="product">
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
            </a>
            <div class="quantity-control">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">0</span>
                <button class="quantity-btn plus">+</button>
            </div>
        </div>
    `;
}

// Function to display products on the main page
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; // Exit if we're not on the main page

    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="view-details-btn" onclick="location.href='product-detail.html?id=${product.id}'">View Details</button>
        `;
        productGrid.appendChild(productElement);
    });
}

// Function to display product details on the product detail page
function displayProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("Product not found");
        return;
    }

    document.getElementById('main-product-image').src = product.images[0];
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;

    // Populate image thumbnails
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    thumbnailsContainer.innerHTML = '';
    product.images.forEach((img, index) => {
        if (img) { // Only add thumbnail if image exists
            thumbnailsContainer.innerHTML += `<img src="${img}" alt="${product.name}" onclick="changeMainImage(this, ${index})">`;
        }
    });

    // Set the first thumbnail as active
    if (thumbnailsContainer.firstChild) {
        thumbnailsContainer.firstChild.classList.add('active');
    }
}

function changeMainImage(clickedImage, index) {
    document.getElementById('main-product-image').src = clickedImage.src;
    
    // Remove 'active' class from all thumbnails
    document.querySelectorAll('.image-thumbnails img').forEach(img => img.classList.remove('active'));
    
    // Add 'active' class to clicked thumbnail
    clickedImage.classList.add('active');
}

// Quantity control functionality
document.addEventListener('DOMContentLoaded', function() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantitySpan = document.querySelector('.quantity');

    minusBtn.addEventListener('click', function() {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantitySpan.textContent = quantity - 1;
        }
    });

    plusBtn.addEventListener('click', function() {
        let quantity = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = quantity + 1;
    });
});

// Check which page we're on and run the appropriate function
if (document.getElementById('product-grid')) {
    displayProducts();
} else if (document.getElementById('product-details')) {
    displayProductDetails();
}

// Make sure this function is called when the product detail page loads
document.addEventListener('DOMContentLoaded', displayProductDetails);
