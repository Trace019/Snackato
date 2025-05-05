const initApp = () => {
    fetch('json-file/mcdo-products.json')
    .then(response => response.json())
    .then(data => {
        // Target a specific JSON ID
        const specificProducts = data.filter(product => [1, 2, 3, 4, 5, 6, 7, 8].includes(product.id));
        
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
