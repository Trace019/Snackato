let iconCart = document.querySelector('.cart-icon');
let closeCart = document.querySelector('.close');
let body = document.querySelector('#toggle-open');
let listProductHTML = document.querySelector('.productList');
let listCartHTML = document.querySelector('.cartList');
let iconCartSpan = document.querySelector('.cart-icon span');

let productList = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(productList.length > 0){
        productList.forEach( product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('food-item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `                        
            <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="item-price">₱${product.price}</div>
                <button class="add-cart">
                    Add To Cart
                </button>
                `;
                listProductHTML.appendChild(newProduct);
        })
    }
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('add-cart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})
const addToCart =(product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push ({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts [positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = () => {
    let totalQuantity = 0;
    listCartHTML.innerHTML = '';
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('food-item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = productList.findIndex((value) => value.id == cart.product_id);
            let info = productList[positionProduct];
            if (info) {
                newCart.innerHTML = `<div class="cart-item">
                            <div class="item-image">
                                <img src="${info.image}" alt="">
                            </div>
                            <div class="cart-item-name">
                                ${info.name}
                            </div>
                            <div class="total-price">
                                ₱${info.price * cart.quantity}
                            </div>
                            <div class="quantity">
                                <span class="minus"><</span>
                                <span>${cart.quantity}</span>
                                <span class="plus">></span>
                            </div>
                        </div>
                        `;
            }
        listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.closest('.food-item').dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
});
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}
