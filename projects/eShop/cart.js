function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity" data-id="${item.id}">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        
        total += item.price * item.quantity;
    });

    cartTotalContainer.textContent = `Total: $${total.toFixed(2)}`;

    addCartEventListeners();
}

function addCartEventListeners() {
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const removeButtons = document.querySelectorAll('.remove-item');

    minusButtons.forEach(button => {
        button.addEventListener('click', decreaseCartItemQuantity);
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', increaseCartItemQuantity);
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
}

function decreaseCartItemQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function increaseCartItemQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function removeCartItem(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality not implemented yet.');
    });
});
