document.addEventListener("DOMContentLoaded", () => {
  loadOrderData(); // fro hgetting local storage id:order
  setupDownloadButton(); //f for the download button
  setupDeleteButton(); // for the delete button
  setupExitHandler(); // when you leave the invoice:parameter it automatically delete's the invoice for you.
});

// Get Order ID from le URL Parameter
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");

function loadOrderData() {
  if (!orderId) {
    console.error("No order ID found in URL");
    displayError("No order ID found in URL.");
    return;
  }

  try {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    console.log("Orders from localStorage:", orders);
    console.log("Type of orders:", typeof orders);

    const orderData = orders.find((order) => order.orderId === orderId);

    if (orderData) {
      populateInvoice(orderData);
    } else {
      console.error("No such order found!");
      displayError(
        "The requested order could not be found in your order history."
      );
    }
  } catch (error) {
    console.error("Error loading order:", error);
    displayError(
      "An error occurred while loading the order, please try again later."
    );
  }
}

// Populate invoice with order data
function populateInvoice(orderData) {
  // Display order ID
  document.getElementById("orderIdDisplay").textContent = orderData.orderId;

  // Customer Info
  document.getElementById("billedToName").textContent = orderData.customerName;

  document.getElementById("billedToAddress").textContent =
    orderData.customerAddress;

  document.getElementById("billedToPhone").textContent =
    orderData.customerPhone || "N/A";

  document.getElementById("billedToEmail").textContent =
    orderData.customerEmail || "No Email Specified"; // Assuming email is optional
    
  document.getElementById("billedToDate").textContent = new Date(
    orderData.date
    
  ).toLocaleDateString();

  // Cart items
  const tableBody = document.getElementById("invoiceItems");
  // Clear existing rows
  tableBody.innerHTML = "";

  let subtotal = 0;
  orderData.items.forEach((item) => {
    const row = tableBody.insertRow();
    const totalPrice = item.price * item.quantity;
    subtotal += totalPrice;
    row.innerHTML = `
            <td>${item.name}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₱${totalPrice.toFixed(2)}</td>
        `;
  });

  // Add subtotal/total price
  const subtotalRow = tableBody.insertRow();
  subtotalRow.innerHTML = `
        <th colspan="3">Subtotal:</th>
        <th>₱${subtotal.toFixed(2)}</th>
    `;

  // Add tax
  const tax = subtotal * 0.1;
  const taxRow = tableBody.insertRow();
  taxRow.innerHTML = `
        <th colspan="3">Tax (10%):</th>
        <th>₱${tax.toFixed(2)}</th>
    `;

  // Add grand total price
  const grandTotalRow = tableBody.insertRow();
  const grandTotal = subtotal + tax;
  grandTotalRow.innerHTML = `
        <th colspan="3">Grand Total:</th>
        <th>₱${grandTotal.toFixed(2)}</th>
    `;
}

// Error Message
function displayError(message) {
  document.querySelector(".invoice-container").innerHTML = `
        <div class="error-message">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
            <h2>Error</h2>
            <p>${message}</p>
            <a href="homepage.html">Return to Homepage</a>
        </div>
    `;
}

// Setup download button
function setupDownloadButton() {
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download Invoice";
  downloadBtn.classList.add("download-btn");
  downloadBtn.addEventListener("click", downloadInvoice);

  const container = document.querySelector(".invoice-container");
  container.appendChild(downloadBtn);
}
function setupDeleteButton() {
  const deleteBtn =
    document.querySelector(".delete-invoice") ||
    document.createElement("button");

  // If button doesn't exist in HTML, create it
  if (!document.querySelector(".delete-invoice")) {
    deleteBtn.textContent = "Delete Invoice";
    deleteBtn.classList.add("delete-btn");
    const container = document.querySelector(".invoice-container");
    container.appendChild(deleteBtn);
  }

  deleteBtn.addEventListener("click", () => {
    removeCurrentOrder(); // Extract deletion logic to reusable function
    window.location.href = "homepage.html";
  });
}

function setupExitHandler() {
  window.addEventListener("beforeunload", () => {
    if (confirm("Clear this invoice from your history?")) {
      removeCurrentOrder();
    }
  });
}

// Reusable function to remove the current order
function removeCurrentOrder() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const updatedOrders = orders.filter((order) => order.orderId !== orderId);
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
}

// Download invoice as PDF (cuz receipt)
function downloadInvoice() {
  const invoiceElement = document.querySelector(".invoice-content");
  const opt = {
    margin: 10,
    filename: `order_receipt_from_snackato_${orderId}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  // Use html2pdf library
  html2pdf().from(invoiceElement).set(opt).save();
}
