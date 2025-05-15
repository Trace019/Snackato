// invoice.js
document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
    setupDownloadButton();
});

// Get order ID from URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

function loadOrderData() {
    if (!orderId) {
        console.error("No order ID found in URL");
        return;
    }

    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderData = orders.find(order => order.orderId === orderId);
        
        if (orderData) {
            populateInvoice(orderData);
        } else {
            console.error("No such order found!");
            document.querySelector('.invoice-container').innerHTML = `
                <div class="error-message">
                    <h2>Order Not Found</h2>
                    <p>The requested order could not be found in your order history.</p>
                    <a href="homepage.html">Return to Homepage</a>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading order:", error);
    }
}

// Populate invoice with order data
function populateInvoice(orderData) {
    // Display order ID
    document.getElementById('orderIdDisplay').textContent = orderData.orderId;
    
    // Customer Info
    document.getElementById('billedToName').textContent = orderData.customerName;
    document.getElementById('billedToAddress').textContent = orderData.customerAddress;
    document.getElementById('billedToPhone').textContent = orderData.customerPhone;
    document.getElementById('billedToDate').textContent = new Date(orderData.date).toLocaleDateString();
    
    // Order items
    const tableBody = document.querySelector('.invoice-table table');
    // Clear existing rows except header
    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(1);
    }
    
    // Add order items
    orderData.items.forEach(item => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₱${(item.price * item.quantity).toFixed(2)}</td>
        `;
    });
    
    // Add subtotal
    const subtotalRow = tableBody.insertRow();
    subtotalRow.innerHTML = `
        <th colspan="3">Subtotal:</th>
        <th>₱${orderData.total.toFixed(2)}</th>
    `;
    
    // Add tax
    const taxRow = tableBody.insertRow();
    taxRow.innerHTML = `
        <th colspan="3">Tax (12%):</th>
        <th>₱${orderData.tax.toFixed(2)}</th>
    `;
    
    // Add grand total
    const grandTotalRow = tableBody.insertRow();
    grandTotalRow.innerHTML = `
        <th colspan="3">Grand Total:</th>
        <th>₱${orderData.grandTotal.toFixed(2)}</th>
    `;
}

// Setup download button instead of print
function setupDownloadButton() {
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download Invoice';
    downloadBtn.classList.add('download-btn');
    downloadBtn.addEventListener('click', downloadInvoice);
    
    const container = document.querySelector('.invoice-container');
    container.appendChild(downloadBtn);
}

// Download invoice as PDF
function downloadInvoice() {
    const invoiceElement = document.querySelector('.invoice-content');
    const opt = {
        margin: 10,
        filename: `invoice_${orderId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use html2pdf library (make sure to include it in your HTML)
    html2pdf().from(invoiceElement).set(opt).save();
}