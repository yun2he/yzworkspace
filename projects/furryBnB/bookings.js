document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let customers = JSON.parse(localStorage.getItem('customers')) || [];

    // Get DOM elements
    const bookingForm = document.getElementById('booking-form');
    const bookingsList = document.getElementById('bookings-list');
    const customerSelect = document.getElementById('customer-select');
    const petNameInput = document.getElementById('pet-name');
    const ownerNameInput = document.getElementById('owner-name');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const notesInput = document.getElementById('notes');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const editingIndexInput = document.getElementById('editing-index');
    const filterBy = document.getElementById('filter-by');
    const sortBy = document.getElementById('sort-by');
    const sortOrderBtn = document.getElementById('sort-order');

    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

    // Event listeners
    bookingForm.addEventListener('submit', handleBookingFormSubmit);
    cancelBtn.addEventListener('click', resetBookingForm);
    customerSelect.addEventListener('change', handleCustomerSelect);
    startDateInput.addEventListener('change', updateEndDateMin);
    filterBy.addEventListener('change', updateBookingsList);
    sortBy.addEventListener('change', updateBookingsList);
    sortOrderBtn.addEventListener('click', toggleSortOrder);

    // Function definitions
    function updateBookingsList() {
        const filterValue = filterBy.value;
        const sortValue = sortBy.value;
        const sortOrder = sortOrderBtn.textContent === '↑' ? 'asc' : 'desc';
        const currentDate = new Date().toISOString().split('T')[0];

        let filteredBookings = bookings.filter(booking => {
            switch (filterValue) {
                case 'current':
                    return booking.startDate <= currentDate && booking.endDate >= currentDate;
                case 'upcoming':
                    return booking.startDate > currentDate;
                case 'past':
                    return booking.endDate < currentDate;
                default:
                    return true;
            }
        });

        filteredBookings.sort((a, b) => {
            let comparison = 0;
            switch (sortValue) {
                case 'startDate':
                    comparison = new Date(a.startDate) - new Date(b.startDate);
                    break;
                case 'endDate':
                    comparison = new Date(a.endDate) - new Date(b.endDate);
                    break;
                case 'petName':
                    comparison = a.petName.localeCompare(b.petName);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        bookingsList.innerHTML = '';
        filteredBookings.forEach(booking => {
            const startDate = new Date(booking.startDate + 'T00:00:00');
            const endDate = new Date(booking.endDate + 'T00:00:00');
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            const li = document.createElement('li');
            li.className = 'booking-item';
            li.innerHTML = `
                <div class="booking-info">
                    <div class="booking-main-info">
                        ${booking.petName} (${booking.ownerName}) 
                    </div>
                    <div class="booking-dates">
                        ${formatDate(booking.startDate)}-${formatDate(booking.endDate)} (${days} nights)
                    </div>
                    <div class="booking-notes">
                        ${booking.notes ? booking.notes : 'No notes'}
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn-icon btn-edit" data-id="${booking.id}">
                        <img src="icon/edit.png" alt="Edit">
                    </button>
                    <button class="btn-icon btn-delete" data-id="${booking.id}">
                        <img src="icon/trash.png" alt="Delete">
                    </button>
                </div>
            `;
            bookingsList.appendChild(li);

            // Add event listeners to newly created buttons
            const editBtn = li.querySelector('.btn-edit');
            const deleteBtn = li.querySelector('.btn-delete');

            editBtn.addEventListener('click', editBooking);
            deleteBtn.addEventListener('click', deleteBooking);
        });
    }

    function handleBookingFormSubmit(e) {
        e.preventDefault();
        if (validateBookingForm()) {
            const selectedCustomerId = customerSelect.value;
            let customerId = selectedCustomerId;

            // If it's a new customer, create a new customer record
            if (selectedCustomerId === 'new') {
                const newCustomer = {
                    id: Date.now().toString(),
                    petName: petNameInput.value.trim(),
                    ownerName: ownerNameInput.value.trim()
                };
                customers.push(newCustomer);
                saveCustomers();
                updateCustomerSelect();
                customerId = newCustomer.id;
            }

            const newBooking = {
                id: editingIndexInput.value || Date.now().toString(),
                customerId: customerId,
                petName: petNameInput.value.trim(),
                ownerName: ownerNameInput.value.trim(),
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                notes: notesInput.value.trim()
            };

            const editingId = editingIndexInput.value;
            if (editingId) {
                const index = bookings.findIndex(b => b.id === editingId);
                if (index !== -1) {
                    bookings[index] = newBooking;
                }
            } else {
                bookings.push(newBooking);
            }

            saveBookings();
            updateBookingsList();
            resetBookingForm();
        }
    }

    function handleCustomerSelect() {
        const selectedValue = customerSelect.value;
        if (selectedValue === 'new') {
            petNameInput.readOnly = false;
            ownerNameInput.readOnly = false;
            petNameInput.value = '';
            ownerNameInput.value = '';
        } else if (selectedValue) {
            const selectedCustomer = customers.find(c => c.id === selectedValue);
            if (selectedCustomer) {
                petNameInput.value = selectedCustomer.petName;
                ownerNameInput.value = selectedCustomer.ownerName;
                petNameInput.readOnly = true;
                ownerNameInput.readOnly = true;
            }
        } else {
            petNameInput.value = '';
            ownerNameInput.value = '';
            petNameInput.readOnly = true;
            ownerNameInput.readOnly = true;
        }
    }

    function editBooking(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const booking = bookings.find(b => b.id === id);

        if (booking) {
            customerSelect.value = booking.customerId;
            petNameInput.value = booking.petName;
            ownerNameInput.value = booking.ownerName;
            startDateInput.value = booking.startDate;
            endDateInput.value = booking.endDate;
            notesInput.value = booking.notes || '';
            editingIndexInput.value = booking.id;

            submitBtn.textContent = 'Update Booking';
            cancelBtn.style.display = 'inline-block';

            window.scrollTo(0, bookingForm.offsetTop);
        }
    }

    function deleteBooking(e) {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this booking?')) {
            bookings = bookings.filter(b => b.id !== id);
            saveBookings();
            updateBookingsList();
        }
    }

    function resetBookingForm() {
        bookingForm.reset();
        editingIndexInput.value = '';
        submitBtn.textContent = 'Submit Booking';
        cancelBtn.style.display = 'none';
        customerSelect.disabled = false;
        petNameInput.readOnly = true;
        ownerNameInput.readOnly = true;
        endDateInput.min = today;
    }

    function updateEndDateMin() {
        endDateInput.min = startDateInput.value;
        if (endDateInput.value < startDateInput.value) {
            endDateInput.value = startDateInput.value;
        }
    }

    function toggleSortOrder() {
        sortOrderBtn.textContent = sortOrderBtn.textContent === '↑' ? '↓' : '↑';
        updateBookingsList();
    }

    function updateCustomerSelect() {
        customerSelect.innerHTML = `
            <option value="">-- Select Customer --</option>
            <option value="new">-- New Customer --</option>
        `;

        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.petName} (${customer.ownerName})`;
            customerSelect.appendChild(option);
        });
    }

    function validateBookingForm() {
        // Add form validation logic
        return true; // Temporarily return true, you can add specific validation logic as needed
    }

    function saveBookings() {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    function saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Initialize
    updateCustomerSelect();
    updateBookingsList();
});
