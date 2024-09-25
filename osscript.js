// Product data (you can replace this with actual data from a database)
const products = [
    { id: 1, name: "Product 1", description: "Description of Product 1", price: 19.99, image: "products/1.png" },
    { id: 2, name: "Product 2", description: "Description of Product 2", price: 29.99, image: "products/2.png" },
    { id: 3, name: "Product 3", description: "Description of Product 3", price: 39.99, image: "products/3.png" },
    { id: 4, name: "Product 4", description: "Description of Product 4", price: 49.99, image: "products/4.png" },
    { id: 5, name: "Product 5", description: "Description of Product 5", price: 59.99, image: "products/5.png" },
    { id: 6, name: "Product 6", description: "Description of Product 6", price: 69.99, image: "products/6.png" },
    { id: 7, name: "Product 7", description: "Description of Product 7", price: 79.99, image: "products/7.png" },
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

// Function to display products on the home page
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = products.map(generateProductHTML).join('');
    }
}

// Function to display product details on the product detail page
function displayProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (product) {
        const productDetails = document.getElementById('product-details');
        if (productDetails) {
            productDetails.innerHTML = `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">0</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <a href="onlineShop.html" class="back-button">Back to Products</a>
                </div>
            `;
        }
    }
}

// Check which page we're on and run the appropriate function
if (document.getElementById('product-grid')) {
    displayProducts();
} else if (document.getElementById('product-details')) {
    displayProductDetails();
}
