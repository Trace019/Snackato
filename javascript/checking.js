let listCart = [];

function checkCart() {
    var cookieValue = document.cookie.split('; ').find(row => row.startsWith('listCart'));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}

checkCart();
addCheckoutToHTML();
function addCheckoutToHTML() {
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';
    // Clear the list before adding new items
    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');

    let totalQuantity = 0;
    let totalPrice = 0;

    // product in cart
    if(listCart){
        listCart.forEach(product => {
            let newP = document.createElement('div');
            newP.classList.add('item');
            newP.innerHTML = 
            `<img src="${product.image}" alt="Food 1">
                                <div class="info">
                                    <div class="productName">${product.name}</div>
                                    <div class="productPrice">₱${product.price}/1 Product</div>
                                </div>
                                <div class="productQuantity">${product.quantity}</div>
                                <div class="returnPrice">₱${product.price * product.quantity}</div>`;
            listCartHTML.appendChild(newP);
            totalQuantity = totalQuantity + product.quantity;
            totalPrice = totalPrice + (product.price * product.quantity);

        })
    }
totalQuantityHTML.innerText = totalQuantity;
totalPriceHTML.innerText = "₱" + totalPrice;
}