async function updateUserStatus() {
    try {
        const response = await fetch('/api/checkLogin');
        const data = await response.json();

        const userStatusDiv = document.getElementById('login-block');

        if (data.isLoggedIn) {
            userStatusDiv.innerHTML = `
                <span>Hello, ${data.username}</span> 
                <div class="user-container">
                    <img src="/images/userIcon.png" alt="User Icon" class="user-icon" id="userIcon">
                    <div id="userMenu" class="user-menu">
                        <a href="#" id="userProfileButton">User Profile</a>
                        <a href="#" id="logoutButton">Logout</a>
                    </div>
                </div>
            `;

            const userIcon = document.getElementById('userIcon');
            const userMenu = document.getElementById('userMenu');
            if (userIcon) {
                userIcon.addEventListener('click', () => {
                    userMenu.classList.toggle('show');
                });
            }

            const userProfileButton = document.getElementById('userProfileButton');
            if (userProfileButton) {
                userProfileButton.addEventListener('click', () => {
                    window.location.href = '/profile';
                });
            };

            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    const response = await fetch('/api/logout', { method: 'POST' });
                    if (response.ok) {
                        updateUserStatus();
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 500);
                    } else {
                        console.error('Logout failed');
                    }
                });
            }

        } else {
            userStatusDiv.innerHTML = `
                <a href="/signinPage">Sign in</a>
                <span>|</span>
                <a href="/registerPage">Register</a>
                <img src="/images/FlagofCanada.png" alt="Canadian Flag">
                <span>CAD</span>
            `;
        }
    } catch (error) {
        console.error('Error fetching login status:', error);
    }
}

async function isUserLoggedIn() {
    try {
        const response = await fetch('/api/checkLogin');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

// order methods
async function getOrders(user) {
    let orders = [];
    if (user.email === 'admin@gmail.com') {
        orders = await fetch('/api/orders');
    } else {
        orders = await fetch(`/api/orders/${user.email}`);
    }
    return orders;
};

async function addOrder(orders) {
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
    };
    await fetch('/orders', options);
}

async function displayOrderDetails(loggedUser) {
    const detailsDiv = document.getElementById('orders-container');
    const ordersFetch = await getOrders(loggedUser);
    const ordersContainer = document.createElement('div');
    const orders = await ordersFetch.json();
    if (orders.length === 0) {
        ordersContainer.innerHTML = `<strong> You do not have orders. <a href="/shoppingPage">Make one.</a></strong>`; 
    }
    orders.forEach(order => {
        const orderContainer = document.createElement('div');
        let innerHTML = `<hr>
            <strong>Receiver:</strong> ${order.user.username} (${order.user.email})<br>
            <strong>Address:</strong> ${order.user.address}<br>
            <strong>Status:</strong> ${order.status ? 'Delivered' : 'In progress'}<br>
            <strong>Items:</strong> <ul>`;
        order.items.forEach(item => {
            innerHTML += `<li>${item.product_name} x ${item.quantity} = ${(item.quantity * item.price).toFixed(2)}</li>`;
        });
        innerHTML += `</ul><br><strong>Total Price:</strong> ${order.total_price}<br><hr>`
        orderContainer.innerHTML = innerHTML;
        ordersContainer.appendChild(orderContainer);
    });
    detailsDiv.append(ordersContainer);
}

// load content on page

document.addEventListener('DOMContentLoaded', async () => {
    updateUserStatus();
    const userLoggedIn = await isUserLoggedIn();
    if (!userLoggedIn.isLoggedIn) {
        window.location.href = '/signinPage';
        return;
    } else {
        const usernameContainer = document.getElementById('username');
        usernameContainer.innerHTML = `${userLoggedIn.username}`
        const emailContainer = document.getElementById('email');
        emailContainer.innerHTML = `${userLoggedIn.email}`
        await displayOrderDetails(userLoggedIn);
    }
});