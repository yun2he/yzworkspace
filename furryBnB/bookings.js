document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // 获取 DOM 元素
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

    // 设置日期输入框的最小值为今天
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

    // 事件监听器
    bookingForm.addEventListener('submit', handleBookingFormSubmit);
    cancelBtn.addEventListener('click', resetBookingForm);
    customerSelect.addEventListener('change', handleCustomerSelect);
    startDateInput.addEventListener('change', updateEndDateMin);
    filterBy.addEventListener('change', updateBookingsList);
    sortBy.addEventListener('change', updateBookingsList);
    sortOrderBtn.addEventListener('click', toggleSortOrder);

    // 函数定义
    function updateBookingsList() {
        const filterValue = filterBy.value;
        const sortValue = sortBy.value;
        const sortOrder = sortOrderBtn.textContent === '↑' ? 'asc' : 'desc';
        const currentDate = new Date().toISOString().split('T')[0];

        let filteredBookings = bookings.filter(booking => {
            switch(filterValue) {
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
            switch(sortValue) {
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
                        ${formatDate(booking.startDate)}-${formatDate(booking.endDate)} (${days}晚)
                    </div>
                    <div class="booking-notes">
                        ${booking.notes ? booking.notes : '无备注'}
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn-icon btn-edit" data-id="${booking.id}">
                        <img src="icon/edit.png" alt="编辑">
                    </button>
                    <button class="btn-icon btn-delete" data-id="${booking.id}">
                        <img src="icon/trash.png" alt="删除">
                    </button>
                </div>
            `;
            bookingsList.appendChild(li);

            // 为新创建的按钮添加事件监听器
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

            // 如果是新客户，创建新的客户记录
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

            submitBtn.textContent = '更新预订';
            cancelBtn.style.display = 'inline-block';

            window.scrollTo(0, bookingForm.offsetTop);
        }
    }

    function deleteBooking(e) {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('确定要删除这个预订吗？')) {
            bookings = bookings.filter(b => b.id !== id);
            saveBookings();
            updateBookingsList();
        }
    }

    function resetBookingForm() {
        bookingForm.reset();
        editingIndexInput.value = '';
        submitBtn.textContent = '提交预订';
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
            <option value="">-- 选择客户 --</option>
            <option value="new">-- 新客户 --</option>
        `;

        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.petName} (${customer.ownerName})`;
            customerSelect.appendChild(option);
        });
    }

    function validateBookingForm() {
        // 添加表单验证逻辑
        return true; // 暂时返回 true，您可以根据需要添加具体的验证逻辑
    }

    function saveBookings() {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    function saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    function formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00'); // 添加时间部分以确保使用本地时间
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
    }

    // 初始化
    updateCustomerSelect();
    updateBookingsList();
});
