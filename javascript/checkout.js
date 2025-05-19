import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
        setupAutofill();
    })
    .catch(err => console.error('Failed to load JSON', err));

// Load cart from localStorage
function checkCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart !== null) {
        try {
            listCart = JSON.parse(storedCart);
        } catch (error) {
            console.error("Error parsing cart data:", error);
            listCart = [];
        }
    } else {
        listCart = [];
    }
}

// Merge cart items with product details
function mergeCartWithProducts() {
    listCart = listCart.map(cartItem => {
        const productInfo = productList.find(p => p.id == cartItem.product_id);
        return productInfo ? {
            ...cartItem,
            name: productInfo.name,
            price: productInfo.price,
            image: productInfo.image
        } : {
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
    let totalTaxHTML = document.querySelector('.totalTax');
    let totalGrandPrice = document.querySelector('.totalGrandPrice')

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
            newP.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="info">
                    <div class="productName">${product.name}</div>
                    <div class="productPrice">₱${product.price.toFixed(2)}</div>
                </div>
                <div class="productQuantity">${product.quantity}</div>
                <div class="returnPrice">₱${(product.price * product.quantity).toFixed(2)}</div>`;
            listCartHTML.appendChild(newP);
            totalQuantity += product.quantity;
            totalPrice += product.price * product.quantity;
        });
    } else {
        listCartHTML.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    }

    const totalTax = totalPrice * 0.10;
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = "₱" + totalPrice.toFixed(2);
    totalTaxHTML.innerText = "₱" + totalTax.toFixed(2);
    totalGrandPrice.innerHTML = "₱" + (totalPrice + totalTax).toFixed(2);
}

// Setup autofill from Firebase user data
async function setupAutofill() {
    try {
        // Wait for Firebase Auth to initialize and get the current user
        await new Promise(resolve => {
            if (auth.currentUser) return resolve();
            const unsubscribe = auth.onAuthStateChanged(() => {
                unsubscribe();
                resolve();
            });
        });
        const user = auth.currentUser;
        if (!user) {
            console.log("No user logged in");
            return;
        }

        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Fill form with user data from Firebase
            document.getElementById('name').value = userData.username || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('address').value = userData.address || '';
        } else {
            console.log("No user data found in Firestore");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        
        // Fallback to local storage if Firebase fails
        const lastOrder = JSON.parse(localStorage.getItem('lastOrderInfo')) || {};
        document.getElementById('name').value = lastOrder.name || '';
        document.getElementById('phone').value = lastOrder.phone || '';
        document.getElementById('address').value = lastOrder.address || '';
        document.getElementById('email').value = lastOrder.email || '';
    }
}

export async function submitOrder() {
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value || '';
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment').value;

    // Validate form
    if (!name || !address) {
        alert("Please fill in all required fields");
        return false;
    }

    // Calculate total
    const total = listCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        orderId: `order_${Date.now()}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        paymentMethod: paymentMethod,
        items: listCart.map(item => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        })),
        total: total,
        grandTotal: total * 1.12, // 12% tax
        date: new Date().toISOString(),
        userId: auth.currentUser?.uid || null
    };

    // Save order to localStorage
    saveOrderToLocalStorage(order);

    // Clear cart
    localStorage.removeItem("cart");
    listCart = [];

    // Redirect to invoice page
    window.location.href = `invoice.html?orderId=${order.orderId}`;
    return true;
}

// Save order to localStorage
function saveOrderToLocalStorage(order) {
    let orders = JSON.parse(localStorage.getItem('orders'));
    if (!orders || !Array.isArray(orders)) {
        orders = [];
    }
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}