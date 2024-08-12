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
    const ordersContainer = document.createElement('div');
    const ordersFetch = await getOrders(loggedUser);
    const orders = await ordersFetch.json();
    if (orders.length === 0) {
        ordersContainer.innerHTML = `<strong> You do not have orders. <a href="/shoppingPage">Make one.</a></strong>`;
    }
    orders.forEach(order => {
        const orderContainer = document.createElement('div');
        const orderDate = new Date(order.createdAt); // Convert the timestamp to a readable date
        let innerHTML = `
            <strong>Order Date:</strong> ${orderDate.toLocaleString()}<br>
            <strong>Receiver:</strong> ${order.user.username} (${order.user.email})<br>
            <strong>Address:</strong> ${order.user_address.address}<br>
            <strong>City:</strong> ${order.user_address.city}<br>
            <strong>State:</strong> ${order.user_address.state}<br>
            <strong>Postal Code:</strong> ${order.user_address.postalCode}<br>
            <strong>Country:</strong> ${order.user_address.country}<br>
            <strong>Status:</strong> ${order.status ? 'Delivered' : 'In progress'}<br>
            <strong>Items:</strong> <ul>`;
        order.items.forEach(item => {
            innerHTML += `<li>${item.product[0].product_name} x ${item.quantity} = ${(item.quantity * item.product[0].price).toFixed(2)}</li>`;
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

        document.getElementById('editUsername').value = userLoggedIn.username; //user edit
        document.getElementById('editEmail').value = userLoggedIn.email; //email edit

    }
    const editUsernameButton = document.getElementById('editUsernameButton'); //editing the user and email
    const editEmailButton = document.getElementById('editEmailButton');
    const editFormContainer = document.getElementById('editFormContainer');

    editUsernameButton.addEventListener('click', () => {
        editFormContainer.style.display = 'block';
        document.getElementById('editUsername').focus();
    });

    editEmailButton.addEventListener('click', () => {
        editFormContainer.style.display = 'block';
        document.getElementById('editEmail').focus();
    });

    const profileForm = document.getElementById('editProfileForm');
    profileForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const updatedUsername = document.getElementById('editUsername').value;
        const updatedEmail = document.getElementById('editEmail').value;

        try {
            const response = await fetch('/api/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: updatedUsername, email: updatedEmail })
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                window.location.href = '/profile';
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });
    if (userLoggedIn.email == 'admin@gmail.com') {
        const productsFetch = await fetch('api/product', { method: 'GET' });
        const products = await productsFetch.json();
        const modal = document.getElementById("adminStockModal");
        const btn = document.getElementById("adminStockButton");
        const span = document.getElementsByClassName("adminStockClose")[0];
        btn.style.display = "block";
        btn.onclick = function () {
            modal.style.display = "block";
        }
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        const modalBody = document.getElementById('admin-restock-form');
        products.forEach(product => {
            const productLabel = document.createElement('label');
            productLabel.setAttribute('for', `product${product.product_name}`);
            productLabel.textContent = `${product.product_name} (current stock: ${product.quantity_in_stock}): `;
            const productInput = document.createElement('input');
            productInput.setAttribute('type', 'number');
            productInput.setAttribute('id', `product${product.product_name}`);
            productInput.setAttribute('name', `${product.product_name}`);
            productInput.setAttribute('value', product.quantity_in_stock);
            modalBody.appendChild(productLabel);
            modalBody.appendChild(productInput);
            modalBody.appendChild(document.createElement('br'));
        });
        const button = document.createElement('button');
        button.setAttribute('type', 'submit');
        button.textContent = 'Restock';
        button.className = 'restock-button';
        button.id = 'restockButton';
        modalBody.appendChild(button);
        document.getElementById('admin-restock-form').addEventListener('submit', async function (event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const formValues = Object.fromEntries(formData.entries());
            const values = {
                values: Object.entries(formValues).map(([key, value]) => ({
                    product_name: key,
                    quantity: value,
                }))
            };
            const newStock = await fetch('api/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (newStock.ok) {
                window.alert('Restock Successful');
                window.location.href = '/profile';
            } else {
                window.alert(`Restock Failed: ${newStock.error}`);
            }
        });
        const userDiv = document.getElementById('adminUserListDiv');
        userDiv.style.display = "block";
        const allUsersBody = await fetch('api/users');
        const allUsers = await allUsersBody.json();
        allUsers.forEach(user => {
            if (!user.isAdmin) {
                const userInfo = document.createElement('div');
                userInfo.innerHTML = `<ul>
                <li>Username: ${user.username}</li>
                <li>Email: ${user.username}</li>
                </ul>
                <hr>`;
                userDiv.append(userInfo);
            }
        });
    }
    await displayOrderDetails(userLoggedIn);
});