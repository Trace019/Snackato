const initApp = () => {
    fetch('json-file/kfc-products.json')
    .then(response => response.json())
    .then(data => {
        productList = data;
        addDataToHTML();
        //get from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();