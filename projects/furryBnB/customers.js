document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables
    let customers = [];

    // Load customer data from localStorage
    function loadCustomers() {
        const storedCustomers = localStorage.getItem('customers');
        if (storedCustomers) {
            try {
                customers = JSON.parse(storedCustomers);
            } catch (e) {
                console.error('Error parsing customers data:', e);
                customers = [];
            }
        }
        updateCustomersList();
    }

    // Get DOM elements
    const customerForm = document.getElementById('customer-form');
    const customersList = document.getElementById('customers-list');
    const petNameInput = document.getElementById('pet-name');
    const ownerNameInput = document.getElementById('owner-name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const addressInput = document.getElementById('address');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const editingIdInput = document.getElementById('editing-id');

    // Event listeners
    customerForm.addEventListener('submit', handleCustomerFormSubmit);
    cancelBtn.addEventListener('click', resetCustomerForm);

    function updateCustomersList() {
        customersList.innerHTML = '';
        customers.forEach(customer => {
            const li = document.createElement('li');
            li.className = 'customer-item';
            li.innerHTML = `
                <div class="customer-info">
                    <strong>${customer.petName}</strong> (${customer.ownerName})
                    <br>Phone: ${customer.phone || 'Not provided'}
                    <br>Email: ${customer.email || 'Not provided'}
                    <br>Address: ${customer.address || 'Not provided'}
                </div>
                <div class="customer-actions">
                    <button class="btn-icon btn-edit" data-id="${customer.id}">
                        <img src="icon/edit.png" alt="Edit">
                    </button>
                    <button class="btn-icon btn-delete" data-id="${customer.id}">
                        <img src="icon/trash.png" alt="Delete">
                    </button>
                </div>
            `;
            customersList.appendChild(li);

            // Add event listeners to newly created buttons
            const editBtn = li.querySelector('.btn-edit');
            const deleteBtn = li.querySelector('.btn-delete');

            editBtn.addEventListener('click', editCustomer);
            deleteBtn.addEventListener('click', deleteCustomer);
        });
    }

    function handleCustomerFormSubmit(e) {
        e.preventDefault();
        if (validateCustomerForm()) {
            const newCustomer = {
                id: editingIdInput.value || Date.now().toString(),
                petName: petNameInput.value.trim(),
                ownerName: ownerNameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                address: addressInput.value.trim()
            };

            const editingId = editingIdInput.value;
            if (editingId) {
                const index = customers.findIndex(c => c.id === editingId);
                if (index !== -1) {
                    customers[index] = newCustomer;
                    // Update related bookings
                    updateRelatedBookings(editingId, newCustomer.petName, newCustomer.ownerName);
                }
            } else {
                customers.push(newCustomer);
            }

            saveCustomers();
            updateCustomersList();
            resetCustomerForm();
        }
    }

    function editCustomer(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const customer = customers.find(c => c.id === id);

        if (customer) {
            petNameInput.value = customer.petName;
            ownerNameInput.value = customer.ownerName;
            phoneInput.value = customer.phone || '';
            emailInput.value = customer.email || '';
            addressInput.value = customer.address || '';
            editingIdInput.value = customer.id;

            submitBtn.textContent = 'Update Customer';
            cancelBtn.style.display = 'inline-block';

            window.scrollTo(0, customerForm.offsetTop);
        }
    }

    function deleteCustomer(e) {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this customer?')) {
            customers = customers.filter(c => c.id !== id);
            saveCustomers();
            updateCustomersList();
        }
    }

    function resetCustomerForm() {
        customerForm.reset();
        editingIdInput.value = '';
        submitBtn.textContent = 'Add Customer';
        cancelBtn.style.display = 'none';
    }

    function validateCustomerForm() {
        if (!petNameInput.value.trim() || !ownerNameInput.value.trim()) {
            alert('Pet name and owner name are required.');
            return false;
        }
        return true;
    }

    function saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    // Initialize
    loadCustomers();
});

// Declare these functions at the top of the file
let editCustomer;
let deleteCustomer;

document.addEventListener('DOMContentLoaded', function () {
    // ... other code ...

    // Define functions here
    editCustomer = function (e) {
        // ... edit customer code ...
    };

    deleteCustomer = function (e) {
        // ... delete customer code ...
    };

    // ... other code ...
});

function updateRelatedBookings(customerId, newPetName, newOwnerName) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let updated = false;

    bookings = bookings.map(booking => {
        if (booking.customerId === customerId) {
            updated = true;
            return {
                ...booking,
                petName: newPetName,
                ownerName: newOwnerName
            };
        }
        return booking;
    });

    if (updated) {
        localStorage.setItem('bookings', JSON.stringify(bookings));
        // If the current page is the bookings page, refresh the bookings list
        if (typeof updateBookingsList === 'function') {
            updateBookingsList();
        }
    }
}
