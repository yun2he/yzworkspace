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

    // 设置 products-slider 的宽度
    productsSlider.style.width = `${products.length * 100}vw`;

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

    // 触摸滑动功能
    let startX, moveX;
    let isDragging = false;
    let startScrollLeft;

    homeContent.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        startScrollLeft = homeContent.scrollLeft;
    });

    homeContent.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        moveX = e.touches[0].clientX;
        const x = moveX - startX;
        homeContent.scrollLeft = startScrollLeft - x;
    });

    homeContent.addEventListener('touchend', () => {
        isDragging = false;
        const scrollWidth = homeContent.scrollWidth;
        const scrollLeft = homeContent.scrollLeft;
        const clientWidth = homeContent.clientWidth;
        
        // 计算最接近的商品索引
        const nearestIndex = Math.round(scrollLeft / clientWidth);
        
        // 滚动到最接近的商品
        homeContent.scrollTo({
            left: nearestIndex * clientWidth,
            behavior: 'smooth'
        });
    });

    // 检查图片是否加载成功
    products.forEach((product) => {
        const img = new Image();
        img.onload = () => console.log(`Image ${product.id} loaded successfully`);
        img.onerror = () => console.error(`Failed to load image ${product.id}`);
        img.src = `products/${product.id} (1).png`;
    });
});