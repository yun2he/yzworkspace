document.addEventListener('DOMContentLoaded', function() {
    const contents = document.querySelectorAll('.content');
    const listItems = document.querySelectorAll('nav ul li');
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
    function createProductElement(product) {
        return new Promise((resolve) => {
            const productElement = document.createElement('div');
            productElement.className = 'product-container';
            productElement.id = `product-${product.id}`;
            
            const imageSlider = document.createElement('div');
            imageSlider.className = 'product-image-slider';
            
            let imageCount = 1;
            
            function tryLoadImage(index) {
                return new Promise((resolveImage) => {
                    const img = new Image();
                    img.onload = () => {
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'product-image';
                        imageContainer.innerHTML = `<img src="products/${product.id} (${index}).png" alt="Product ${product.id} - Image ${index}">`;
                        imageSlider.appendChild(imageContainer);
                        imageCount++;
                        resolveImage(true);
                    };
                    img.onerror = () => resolveImage(false);
                    img.src = `products/${product.id} (${index}).png`;
                });
            }

            async function loadImages() {
                let index = 1;
                while (await tryLoadImage(index)) {
                    index++;
                }
                
                productElement.innerHTML = `
                    ${imageSlider.outerHTML}
                    <div class="product-price">
                        <p>$${product.price}</p>
                    </div>
                `;
                
                resolve(productElement);
            }

            loadImages();
        });
    }

    async function loadProducts() {
        for (const product of products) {
            const productElement = await createProductElement(product);
            productsSlider.appendChild(productElement);
        }
        
        // 在所有产品加载完成后，添加水平滑动功能
        addHorizontalSlideFunction();
    }

    loadProducts();

    // 水平滑动功能
    function addHorizontalSlideFunction() {
        const productContainers = document.querySelectorAll('.product-container');
        productContainers.forEach(container => {
            const imageSlider = container.querySelector('.product-image-slider');
            let startX, currentX;
            let isDraggingHorizontal = false;

            function handleHorizontalStart(e) {
                startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                isDraggingHorizontal = true;
            }

            function handleHorizontalMove(e) {
                if (!isDraggingHorizontal) return;
                currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const diff = startX - currentX;
                imageSlider.scrollLeft += diff;
                startX = currentX;
            }

            function handleHorizontalEnd() {
                isDraggingHorizontal = false;
                const containerWidth = imageSlider.clientWidth;
                const scrollLeft = imageSlider.scrollLeft;
                const nearestIndex = Math.round(scrollLeft / containerWidth);
                imageSlider.scrollTo({
                    left: nearestIndex * containerWidth,
                    behavior: 'smooth'
                });
            }

            imageSlider.addEventListener('touchstart', handleHorizontalStart);
            imageSlider.addEventListener('touchmove', handleHorizontalMove);
            imageSlider.addEventListener('touchend', handleHorizontalEnd);

            imageSlider.addEventListener('mousedown', handleHorizontalStart);
            imageSlider.addEventListener('mousemove', handleHorizontalMove);
            imageSlider.addEventListener('mouseup', handleHorizontalEnd);
            imageSlider.addEventListener('mouseleave', handleHorizontalEnd);
        });
    }

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
});