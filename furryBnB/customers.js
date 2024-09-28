document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let customers = [];
    
    // 从 localStorage 加载客户数据
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

    // 获取 DOM 元素
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

    // 事件监听器
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
                    <br>电话: ${customer.phone || '未提供'}
                    <br>邮箱: ${customer.email || '未提供'}
                    <br>地址: ${customer.address || '未提供'}
                </div>
                <div class="customer-actions">
                    <button class="btn-icon btn-edit" data-id="${customer.id}">
                        <img src="icon/edit.png" alt="编辑">
                    </button>
                    <button class="btn-icon btn-delete" data-id="${customer.id}">
                        <img src="icon/trash.png" alt="删除">
                    </button>
                </div>
            `;
            customersList.appendChild(li);

            // 为新创建的按钮添加事件监听器
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
                    // 更新相关的预订
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

            submitBtn.textContent = '更新客户';
            cancelBtn.style.display = 'inline-block';

            window.scrollTo(0, customerForm.offsetTop);
        }
    }

    function deleteCustomer(e) {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('确定要删除这个客户吗？')) {
            customers = customers.filter(c => c.id !== id);
            saveCustomers();
            updateCustomersList();
        }
    }

    function resetCustomerForm() {
        customerForm.reset();
        editingIdInput.value = '';
        submitBtn.textContent = '添加客户';
        cancelBtn.style.display = 'none';
    }

    function validateCustomerForm() {
        if (!petNameInput.value.trim() || !ownerNameInput.value.trim()) {
            alert('宠物名称和主人姓名是必填的。');
            return false;
        }
        return true;
    }

    function saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    // 初始化
    loadCustomers();
});

// 在文件顶部声明这些函数
let editCustomer;
let deleteCustomer;

document.addEventListener('DOMContentLoaded', function() {
    // ... 其他代码 ...

    // 在这里定义函数
    editCustomer = function(e) {
        // ... 编辑客户的代码 ...
    };

    deleteCustomer = function(e) {
        // ... 删除客户的代码 ...
    };

    // ... 其他代码 ...
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
        // 如果当前页面是预订页面，需要刷新预订列表
        if (typeof updateBookingsList === 'function') {
            updateBookingsList();
        }
    }
}
