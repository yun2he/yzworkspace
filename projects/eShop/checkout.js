document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutSummary();
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
});

function displayCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryElement = document.getElementById('checkout-summary');
    let total = 0;

    const summaryHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `<p>${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}</p>`;
    }).join('');

    summaryElement.innerHTML = `
        ${summaryHTML}
        <h3>Total: $${total.toFixed(2)}</h3>
    `;
}

function validateForm() {
    const form = document.getElementById('checkout-form');
    const unitInput = form.querySelector('#unit');
    const unitNumber = unitInput.value.trim();

    if (!/^\d+$/.test(unitNumber)) {
        alert('Please enter a valid unit number.');
        unitInput.style.borderColor = 'red';
        return false;
    }

    // Add more validation as needed

    return true;
}

function handleCheckout(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        alert('Please fill in all required fields.');
        return;
    }

    // In a real application, you would send this data to a server
    const formData = new FormData(event.target);
    const orderData = Object.fromEntries(formData.entries());
    
    // Simulate order processing
    setTimeout(() => {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html'; // Redirect to home page
    }, 1500);
}

(function() {
    emailjs.init("lMCLrIFq_I0y9c_45"); // Replace with your EmailJS user ID
})();

function sendOrderEmail(orderData) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: "your-email@example.com",
        from_name: orderData.name,
        message: JSON.stringify(orderData)
    }).then(
        function(response) {
            console.log("Email sent successfully", response);
        },
        function(error) {
            console.log("Failed to send email", error);
        }
    );
}

// Call this function in handleCheckout after form validation

let stripe = Stripe('YOUR_PUBLISHABLE_KEY');

async function handlePayment(orderData) {
    try {
        const session = await createCheckoutSession(orderData);
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

async function createCheckoutSession(orderData) {
    // In a real implementation, this would be a server call
    // For demonstration, we're mocking the response
    return { id: 'mock_session_id' };
}

// Call handlePayment in your handleCheckout function
