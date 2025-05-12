const initApp = () => {
    fetch('json-file/mcdo-products.json')
    .then(response => response.json())
    .then(data => {
        // Target a specific JSON ID
        const specificProducts = data.filter(product => [9, 10, 11, 12].includes(product.id));
        
        if (specificProducts.length > 0) {
            productList = specificProducts; // Use the specific products
            addDataToHTML();
        }

        // Get from memory
        if (localStorage.getItem('cart')) {
            // Disable filtering of IDs in the JSON when showing the cart
            productList = data; // Use the entire JSON data.
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
}
initApp();