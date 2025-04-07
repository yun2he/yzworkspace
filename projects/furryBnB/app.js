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
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const editingIndexInput = document.getElementById('editing-index');
    const customersList = document.getElementById('customers-list');
    const filterBy = document.getElementById('filter-by');
    const sortBySelect = document.getElementById('sort-by');
    const sortOrderBtn = document.getElementById('sort-order');
    const customerDetails = document.getElementById('customer-details');
    const customerInfoDisplay = document.getElementById('customer-info-display');
    const editCustomerBtn = document.getElementById('edit-customer-btn');
    const closeCustomerDetailsBtn = document.getElementById('close-customer-details');
    const editCustomerForm = document.getElementById('edit-customer-form');
    const customerEditSection = document.getElementById('customer-edit-form');
    const cancelEditCustomerBtn = document.getElementById('cancel-edit-customer');
    let sortOrder = 'desc'; // 默认降序
    
    // 设置日期输入框的最小值为今天
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

    // 事件监听器
    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
        if (endDateInput.value < this.value) {
            endDateInput.value = this.value;
        }
    });

    bookingForm.addEventListener('submit', handleBookingFormSubmit);
    cancelBtn.addEventListener('click', handleBookingCancelEdit);
    customerSelect.addEventListener('change', handleCustomerSelect);
    filterBy.addEventListener('change', updateBookingsList);
    sortBySelect.addEventListener('change', updateBookingsList);
    sortOrderBtn.addEventListener('click', handleSortOrderChange);
    editCustomerForm.addEventListener('submit', handleEditCustomerSubmit);
    cancelEditCustomerBtn.addEventListener('click', cancelEditCustomer);
    editCustomerBtn.addEventListener('click', showEditForm);
    closeCustomerDetailsBtn.addEventListener('click', closeCustomerDetails);

    function handleCustomerSelect(e) {
        const selectedValue = e.target.value;
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
                    ownerName: ownerNameInput.value.trim(),
                    phone: '', // 可以在这里添加额外的客户信息字段
                    email: '',
                    address: ''
                };
                customers.push(newCustomer);
                saveCustomers();
                updateCustomersList();
                customerId = newCustomer.id;
            }

            const newBooking = {
                id: editingIndexInput.value || Date.now().toString(),
                customerId: customerId,
                petName: petNameInput.value.trim(),
                ownerName: ownerNameInput.value.trim(),
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                notes: document.getElementById('notes').value.trim()
            };

            const editingId = editingIndexInput.value;
            if (editingId) {
                const index = bookings.findIndex(b => b.id === editingId);
                if (index !== -1) {
                    // 只更新日期和备注
                    bookings[index].startDate = newBooking.startDate;
                    bookings[index].endDate = newBooking.endDate;
                    bookings[index].notes = newBooking.notes;
                }
            } else {
                bookings.push(newBooking);
            }

            updateBookingsList();
            saveBookings();
            resetBookingForm();
            syncCustomersFromBookings(); // 同步客户信息
        }
    }

    function validateBookingForm() {
        if (!customerSelect.value) {
            alert('请选择客户或创建新客户');
            return false;
        }
        if (!petNameInput.value.trim()) {
            alert('请输入宠物名称');
            return false;
        }
        if (!ownerNameInput.value.trim()) {
            alert('请输入主人姓名');
            return false;
        }
        if (!startDateInput.value) {
            alert('请选择开始日期');
            return false;
        }
        if (!endDateInput.value) {
            alert('请选择结束日期');
            return false;
        }
        if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
            alert('结束日期不能早于开始日期');
            return false;
        }
        return true;
    }

    function updateBookingsList() {
        const filterValue = filterBy.value;
        const currentDate = new Date().toISOString().split('T')[0]; // 获取当前日期
        const sortBy = sortBySelect.value;

        // 首先，对预订进行排序
        bookings.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
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
        bookings.forEach(booking => {
            // 根据筛选条件决定是否显示预订
            let showBooking = false;
            switch(filterValue) {
                case 'all':
                    showBooking = true;
                    break;
                case 'current':
                    showBooking = booking.startDate <= currentDate && booking.endDate >= currentDate;
                    break;
                case 'upcoming':
                    showBooking = booking.startDate > currentDate;
                    break;
                case 'past':
                    showBooking = booking.endDate < currentDate;
                    break;
            }

            if (showBooking) {
                const li = document.createElement('li');
                li.className = 'booking-item';
                li.innerHTML = `
                    <div class="booking-info">
                        ${booking.petName} (${booking.ownerName}) - ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}
                    </div>
                    <div class="booking-actions">
                        <button class="btn-edit" data-id="${booking.id}">编辑</button>
                        <button class="btn-delete" data-id="${booking.id}">删除</button>
                    </div>
                `;
                bookingsList.appendChild(li);
            }
        });

        // 添加编辑和删除事件监听器
        document.querySelectorAll('.booking-actions .btn-edit').forEach(btn => {
            btn.addEventListener('click', editBooking);
        });
        document.querySelectorAll('.booking-actions .btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteBooking);
        });
    }

    function editBooking(e) {
        const id = e.target.getAttribute('data-id');
        const booking = bookings.find(b => b.id === id);

        if (booking) {
            customerSelect.value = booking.customerId;
            petNameInput.value = booking.petName;
            ownerNameInput.value = booking.ownerName;
            startDateInput.value = booking.startDate;
            endDateInput.value = booking.endDate;
            document.getElementById('notes').value = booking.notes || '';

            petNameInput.readOnly = true;
            ownerNameInput.readOnly = true;
            customerSelect.disabled = true;

            editingIndexInput.value = id;
            submitBtn.textContent = '更新预订';
            cancelBtn.style.display = 'inline-block';
        }
    }

    function deleteBooking(e) {
        const id = e.target.getAttribute('data-id');
        if (confirm('确定要删除这个预订吗？')) {
            bookings = bookings.filter(b => b.id !== id);
            updateBookingsList();
            saveBookings();
        }
    }

    function handleBookingCancelEdit() {
        resetBookingForm();
    }

    function resetBookingForm() {
        bookingForm.reset();
        editingIndexInput.value = '';
        submitBtn.textContent = '提交预订';
        cancelBtn.style.display = 'none';
        endDateInput.min = today;
        customerSelect.disabled = false;
        petNameInput.readOnly = true;
        ownerNameInput.readOnly = true;
    }

    function saveBookings() {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    function saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(customers));
        updateCustomerSelect(); // 每次保存客户信息后更新客户选择下拉菜单
    }

    function updateCustomersList() {
        customersList.innerHTML = '';
        customers.forEach(customer => {
            const li = document.createElement('li');
            li.className = 'customer-item';
            li.innerHTML = `
                <div class="customer-info">
                    <strong>${customer.petName}</strong> (${customer.ownerName})
                </div>
                <div class="customer-actions">
                    <button class="btn-view" data-id="${customer.id}">查看</button>
                </div>
            `;
            customersList.appendChild(li);
        });

        // 添加查看事件监听器
        document.querySelectorAll('.customer-actions .btn-view').forEach(btn => {
            btn.addEventListener('click', viewCustomer);
        });

        // 在更新客户列表后，同时更新客户选择下拉菜单
        updateCustomerSelect();
    }

    function viewCustomer(e) {
        const id = e.target.getAttribute('data-id');
        const customer = customers.find(c => c.id === id);

        if (customer) {
            customerInfoDisplay.innerHTML = `
                <p><strong>宠物名称：</strong> ${customer.petName}</p>
                <p><strong>主人姓名：</strong> ${customer.ownerName}</p>
                <p><strong>电话：</strong> ${customer.phone || '未提供'}</p>
                <p><strong>邮箱：</strong> ${customer.email || '未提供'}</p>
                <p><strong>地址：</strong> ${customer.address || '未提供'}</p>
                <p><strong>备注：</strong> ${customer.notes || '无'}</p>
            `;
            document.getElementById('edit-customer-id').value = id; // 设置当前客户ID
            customerDetails.style.display = 'block';
            customerEditSection.style.display = 'none';
            window.scrollTo(0, customerDetails.offsetTop);
        }
    }

    function showEditForm() {
        const id = document.getElementById('edit-customer-id').value;
        const customer = customers.find(c => c.id === id);

        if (customer) {
            document.getElementById('edit-customer-phone').value = customer.phone || '';
            document.getElementById('edit-customer-email').value = customer.email || '';
            document.getElementById('edit-customer-address').value = customer.address || '';
            document.getElementById('edit-customer-notes').value = customer.notes || '';

            customerEditSection.style.display = 'block';
            customerDetails.style.display = 'none';
        }
    }

    function handleEditCustomerSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('edit-customer-id').value;
        const customerIndex = customers.findIndex(c => c.id === id);

        if (customerIndex !== -1) {
            customers[customerIndex].phone = document.getElementById('edit-customer-phone').value.trim();
            customers[customerIndex].email = document.getElementById('edit-customer-email').value.trim();
            customers[customerIndex].address = document.getElementById('edit-customer-address').value.trim();
            customers[customerIndex].notes = document.getElementById('edit-customer-notes').value.trim();

            saveCustomers();
            updateCustomersList(); // 这会同时更新客户列表和客户选择下拉菜单
            viewCustomer({ target: { getAttribute: () => id } });
            cancelEditCustomer();
        }
    }

    function cancelEditCustomer() {
        customerEditSection.style.display = 'none';
        customerDetails.style.display = 'block';
    }

    function closeCustomerDetails() {
        customerDetails.style.display = 'none';
        customerEditSection.style.display = 'none';
    }

    function syncCustomersFromBookings() {
        bookings.forEach(booking => {
            const existingCustomer = customers.find(c => c.id === booking.customerId);
            if (!existingCustomer) {
                customers.push({
                    id: booking.customerId,
                    petName: booking.petName,
                    ownerName: booking.ownerName,
                    phone: '',
                    email: '',
                    address: ''
                });
            } else {
                // 更新现有客户信息
                existingCustomer.petName = booking.petName;
                existingCustomer.ownerName = booking.ownerName;
            }
        });
        saveCustomers();
        updateCustomersList();
    }

    function handleSortOrderChange() {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        sortOrderBtn.textContent = sortOrder === 'asc' ? '↑' : '↓';
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

    // 初始化时同步客户信息
    syncCustomersFromBookings();
    updateBookingsList();
    updateCustomersList();
    updateCustomerSelect(); // 在加载页面时初始化客户选择下拉菜单

    // 添加清空 localStorage 事件监听器
    document.getElementById('clearStorage').addEventListener('click', function() {
        localStorage.clear();
        console.log('localStorage has been cleared');
        // 可选：刷新页面以重新加载初始状态
        location.reload();
    });

    // 添加页面切换功能
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        navButtons.forEach(btn => {
            if (btn.dataset.page === pageId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showPage(this.dataset.page);
        });
    });

    // 默认显示预订页面
    showPage('bookings');
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const day = date.getDate();
    return `${month}/${day}`;
}
