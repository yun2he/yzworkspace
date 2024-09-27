document.addEventListener('DOMContentLoaded', function() {
    const contents = document.querySelectorAll('.content');
    const listItems = document.querySelectorAll('nav ul li');
    const homeContent = document.getElementById('home');
    const productsSlider = document.querySelector('.products-slider');

    // 商品数据
    const products = [
        { id: 1, price: 688 },
        { id: 2, price: 49 },
        { id: 3, price: 99 },
        { id: 4, price: 199 },
        { id: 5, price: 299 },
        { id: 6, price: 399 },
        // 可以继续添加更多商品...
    ];

    // 动态生成商品
    products.forEach((product) => {
        const productElement = document.createElement('div');
        productElement.className = 'product-container';
        productElement.id = `product-${product.id}`;
        productElement.innerHTML = `
            <div class="product-image">
                <img src="products/${product.id} (1).png" alt="Product ${product.id}">
            </div>
            <div class="product-price">
                <p>$${product.price}</p>
            </div>
        `;
        productsSlider.appendChild(productElement);
    });

    // 标签页导航功能
    listItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            hideAllContents();
            hideAllItems();
            item.classList.add('active');
            contents[idx].classList.add('show');
        });
    });

    function hideAllContents() {
        contents.forEach(content => content.classList.remove('show'));
    }

    function hideAllItems() {
        listItems.forEach(item => item.classList.remove('active'));
    }

    // 滑动功能
    let startY, currentY, isDragging = false;
    let startScrollTop, currentScrollTop;
    let lastTime, currentTime, timeDiff;
    let lastScrollTop, scrollDiff, velocity;

    function handleStart(e) {
        startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        isDragging = true;
        startScrollTop = homeContent.scrollTop;
        lastTime = Date.now();
        lastScrollTop = startScrollTop;
        cancelAnimationFrame(momentumID);
    }

    function handleMove(e) {
        if (!isDragging) return;
        currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        currentScrollTop = startScrollTop + (startY - currentY);
        homeContent.scrollTop = currentScrollTop;

        currentTime = Date.now();
        timeDiff = currentTime - lastTime;
        scrollDiff = currentScrollTop - lastScrollTop;

        if (timeDiff > 0) {
            velocity = scrollDiff / timeDiff;
        }

        lastTime = currentTime;
        lastScrollTop = currentScrollTop;
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        momentum();
    }

    let momentumID;
    function momentum() {
        if (Math.abs(velocity) > 0.1) {
            currentScrollTop += velocity * 15;
            velocity *= 0.95;
            homeContent.scrollTop = currentScrollTop;
            momentumID = requestAnimationFrame(momentum);
        } else {
            snapToNearest();
        }
    }

    function snapToNearest() {
        const containerHeight = homeContent.clientHeight;
        const nearestIndex = Math.round(homeContent.scrollTop / containerHeight);
        homeContent.scrollTo({
            top: nearestIndex * containerHeight,
            behavior: 'smooth'
        });
    }

    homeContent.addEventListener('touchstart', handleStart);
    homeContent.addEventListener('touchmove', handleMove);
    homeContent.addEventListener('touchend', handleEnd);

    // 为非触摸设备添加鼠标事件
    homeContent.addEventListener('mousedown', handleStart);
    homeContent.addEventListener('mousemove', handleMove);
    homeContent.addEventListener('mouseup', handleEnd);
    homeContent.addEventListener('mouseleave', handleEnd);

    // 检查图片是否加载成功
    products.forEach((product) => {
        const img = new Image();
        img.onload = () => console.log(`Image ${product.id} loaded successfully`);
        img.onerror = () => console.error(`Failed to load image ${product.id}`);
        img.src = `products/${product.id} (1).png`;
    });
});