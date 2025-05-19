let iconCart = document.querySelector(".cart-icon");
let closeCart = document.querySelector(".close");
let body = document.querySelector("#toggle-open");
let listProductHTML = document.querySelector(".productList");
let listCartHTML = document.querySelector(".cartList");
let iconCartSpan = document.querySelector(".cart-icon span");
let totalPriceElement = document.getElementById("cartPrice");

let productList = [];
let carts = [];


// Toggle cart visibility
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

// Render products
const addDataToHTML = () => {
  listProductHTML.innerHTML = "";
  if (productList.length > 0) {
    productList.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("food-item");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
        <img src="${product.image}" alt="">
        <h3 id="product-name">${product.name}</h3>
        <div class="product-desc">
          <div class="item-price">₱${product.price}</div>
          <button class="add-cart" id="added"> <i class='bx bxs-shopping-bag'></i> </button>
        </div>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

// Add to cart function
const addToCart = (product_id) => {
  let position = carts.findIndex(value => value.product_id == product_id);
  
  if (position >= 0) {
    carts[position].quantity += 1;
  } else {
    carts.push({
      product_id: product_id,
      quantity: 1
    });
  }
  
  addCartToHTML();
  addCartToMemory();
  
  if (typeof createNotification === "function") {
    createNotification("add", "fa-solid fa-circle-check", "Added!", "Product Added to Cart");
  }
};

// Update cart in localStorage
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Render cart
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;

  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity += cart.quantity;
      let product = productList.find(p => p.id == cart.product_id);
      if (product) {
        totalPrice += product.price * cart.quantity;
        
        let newCart = document.createElement("div");
        newCart.classList.add("item");
        newCart.dataset.id = cart.product_id;
        newCart.innerHTML = `
          <div class="cart-item">
            <div class="deselect-item">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <div class="item-image">
              <img src="${product.image}" alt="">
            </div>
            <div class="cart-item-name">
              ${product.name}
            </div>
            <div class="total-price">
              ₱${(product.price * cart.quantity).toFixed(2)}
            </div>
            <div class="quantity">
              <span class="minus"><</span>
              <span>${cart.quantity}</span>
              <span class="plus">></span>
            </div>
          </div>`;
        listCartHTML.appendChild(newCart);
      }
    });
  }
  
  iconCartSpan.innerText = totalQuantity;
  if (totalPriceElement) {
    totalPriceElement.innerText = "₱" + totalPrice.toFixed(2);
  }
};

// Event delegation for product clicks
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("add-cart") || 
      positionClick.classList.contains("bx") ||
      positionClick.closest(".add-cart")) {
    let product_id = positionClick.closest(".food-item")?.dataset.id;
    if (product_id) addToCart(product_id);
  }
});

// Event delegation for cart quantity changes
listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  let product_id = positionClick.closest(".item")?.dataset.id;
  
  if (!product_id) return;
  
  if (positionClick.classList.contains("minus")) {
    changeQuantity(product_id, "minus");
  } else if (positionClick.classList.contains("plus")) {
    changeQuantity(product_id, "plus");
  } else if (positionClick.classList.contains("fa-xmark") || 
             positionClick.closest(".deselect-item")) {
    carts = carts.filter(item => item.product_id != product_id);
    addCartToMemory();
    addCartToHTML();
  }
});

// Change quantity function
const changeQuantity = (product_id, type) => {
  let position = carts.findIndex(value => value.product_id == product_id);
  if (position >= 0) {
    switch (type) {
      case "plus":
        carts[position].quantity += 1;
        break;
      case "minus":
        if (carts[position].quantity > 1) {
          carts[position].quantity -= 1;
        } else {
          carts.splice(position, 1);
        }
        break;
    }
    addCartToMemory();
    addCartToHTML();
  }
};