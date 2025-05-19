let productNotif = document.getElementById('added');
let box = document.querySelector(".notif-box");

function create(type, icon, desc, title) {
    let element = document.createElement('div');
    element.innerHTML = `
        <div class="notification ${type}">
            <div class="icon">
                <i class="${icon}"></i>
            </div>
            <div class="message">
                <h1>${desc}</h1>
                <h5>${title}</h5>
            </div>
            <div class="close-notif" onclick="this.parentElement.parentElement.remove()">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `;

    box.appendChild(element);
    setTimeout(() => {
        element.remove();
    }, 5000);
}

// Export the create function to be used in cart.js
window.createNotification = create;