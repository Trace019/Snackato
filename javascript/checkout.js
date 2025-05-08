let listCart = [];
let productList = [];

// Load product list from JSON file
fetch('./json-file/mcdo-products.json')
    .then(res => res.json())
    .then(products => {
        productList = products;
        checkCart();
        mergeCartWithProducts();
        addCheckoutToHTML();
    })
    .catch(err => console.error('Failed to load JSON', err));

// Load cart from localStorage
function checkCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart !== null) {
        listCart = JSON.parse(storedCart);
    }
}

// Merge cart items with product details
function mergeCartWithProducts() {
    listCart = listCart.map(cartItem => {
        const productInfo = productList.find(p => p.id == cartItem.product_id);
        if (productInfo) {
            return {
                ...cartItem,
                name: productInfo.name,
                price: productInfo.price,
                image: productInfo.image
            };
        }
        return {
            ...cartItem,
            name: 'Unknown Product',
            price: 0,
            image: 'placeholder.jpg'
        };
    });
}

// Render checkout HTML
function addCheckoutToHTML() {
    let listCartHTML = document.querySelector('.returnCart .list');
    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');

    if (!listCartHTML || !totalQuantityHTML || !totalPriceHTML) {
        console.error("One or more required HTML elements not found!");
        return;
    }

    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (listCart.length > 0) {
        listCart.forEach(product => {
            let newP = document.createElement('div');
            newP.classList.add('item');
            newP.dataset.id = product.product_id;
            newP.innerHTML = `<img src="${product.image}" alt="${product.name}">
                                <div class="info">
                                    <div class="productName">${product.name}</div>
                                    <div class="productPrice">₱${product.price}</div>
                                </div>
                                <div class="productQuantity">${product.quantity}</div>
                                <div class="returnPrice">₱${product.price * product.quantity}</div>`;
            listCartHTML.appendChild(newP);
            totalQuantity += product.quantity;
            totalPrice += product.price * product.quantity;
        });
    } else {
        listCartHTML.innerHTML = '<div class="empty-cart">Cart is empty</div>';
    }

    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = "₱" + totalPrice.toFixed(2);
}

