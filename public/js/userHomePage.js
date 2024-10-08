import { updateUserStatus, updateProfile, getOrders, isUserLoggedIn } from "./apiRequests.js";
import { searchOrdersByUsername } from "./filters.js";

async function displayOrderDetails(orders, userEmail) {
    const detailsDiv = document.getElementById('orders-container');
    if (orders.length === 0) {
        detailsDiv.innerHTML = `<strong>You do not have orders. <a href="/shoppingPage">Make one.</a></strong>`;
        return;
    }

    orders.forEach((order, index) => {
        const orderContainer = document.createElement('div');
        orderContainer.className = 'order-container';
        const orderDate = new Date(order.createdAt);
        let innerHTML = `
            <div class="order-details" id="order-${index}">
                <strong>Order Date:</strong> ${orderDate.toLocaleString()}<br>
                <strong>Receiver:</strong> <span class="editable" data-field="username">${order.user.username}</span> (<span class="editable" data-field="email">${order.user.email}</span>)<br>
                <strong>Address:</strong> <span class="editable" data-field="address">${order.user_address.address}</span><br>
                <strong>City:</strong> <span class="editable" data-field="city">${order.user_address.city}</span><br>
                <strong>State:</strong> <span class="editable" data-field="state">${order.user_address.state}</span><br>
                <strong>Postal Code:</strong> <span class="editable" data-field="postalCode">${order.user_address.postalCode}</span><br>
                <strong>Country:</strong> <span class="editable" data-field="country">${order.user_address.country}</span><br>
                <strong>Status:</strong> <span class="editable" data-field="status">${order.status ? 'Delivered' : 'In progress'}</span><br>
                <strong>Items:</strong> <ul>
        `;
        order.items.forEach(item => {
            innerHTML += `<li>${item.product[0].product_name} x ${item.quantity} = ${(item.quantity * item.product[0].price).toFixed(2)}</li>`;
        });
        innerHTML += `</ul><br><strong>Total Price:</strong> ${order.total_price.toFixed(2)}<br>`;
        if (userEmail === 'admin@gmail.com') {
            innerHTML += `
                <button class="edit-order-btn" data-order-id="${order._id}" data-order-index="${index}">Edit Order</button>
                <button class="save-order-btn" data-order-id="${order._id}" data-order-index="${index}" style="display:none;">Save Changes</button>
            `;
        }

        innerHTML += `<hr>`;
        orderContainer.innerHTML = innerHTML;
        detailsDiv.appendChild(orderContainer);
    });

    if (userEmail === 'admin@gmail.com') {
        addEditFunctionality();
    }
}

function addEditFunctionality() {
    const editButtons = document.querySelectorAll('.edit-order-btn');
    const saveButtons = document.querySelectorAll('.save-order-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.target.dataset.orderId;
            const orderIndex = event.target.dataset.orderIndex;
            makeOrderEditable(orderIndex);
        });
    });

    saveButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.target.dataset.orderId;
            const orderIndex = event.target.dataset.orderIndex;
            saveOrderChanges(orderId, orderIndex);
        });
    });
}

function makeOrderEditable(orderIndex) {
    const orderDiv = document.getElementById(`order-${orderIndex}`);
    const editableFields = orderDiv.querySelectorAll('.editable');
    editableFields.forEach(field => {
        field.contentEditable = true;
        field.style.backgroundColor = '#f0f0f0';
    });
    orderDiv.querySelector('.edit-order-btn').style.display = 'none';
    orderDiv.querySelector('.save-order-btn').style.display = 'inline';
}

async function saveOrderChanges(orderId, orderIndex) {
    const orderDiv = document.getElementById(`order-${orderIndex}`);
    const editableFields = orderDiv.querySelectorAll('.editable');
    const updatedOrder = {
        user: {},
        user_address: {},
        status: false
    };

    editableFields.forEach(field => {
        const fieldName = field.dataset.field;
        const fieldValue = field.textContent;
        if (['username', 'email'].includes(fieldName)) {
            updatedOrder.user[fieldName] = fieldValue;
        } else if (fieldName === 'status') {
            updatedOrder.status = fieldValue === 'Delivered';
        } else {
            updatedOrder.user_address[fieldName] = fieldValue;
        }
        field.contentEditable = false;
        field.style.backgroundColor = '';
    });

    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrder)
        });

        if (response.ok) {
            alert('Order updated successfully!');
            orderDiv.querySelector('.edit-order-btn').style.display = 'inline';
            orderDiv.querySelector('.save-order-btn').style.display = 'none';
        } else {
            alert('Failed to update order.');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('An error occurred while updating the order.');
    }
}
// load content on page
document.addEventListener('DOMContentLoaded', async () => {
    await updateUserStatus();
    await fetchUsersAndCreateButtons();

    updateUserStatus();

    attachEditButtonListeners();

    const userLoggedIn = await isUserLoggedIn();
    if (!userLoggedIn.isLoggedIn) {
        window.location.href = '/signinPage';
        return;
    } else {
        document.getElementById('username').innerHTML = userLoggedIn.username;
        document.getElementById('email').innerHTML = userLoggedIn.email;
        document.getElementById('address').innerHTML = userLoggedIn.user.billingAddress;
        document.getElementById('city').innerHTML = userLoggedIn.user.city;
        document.getElementById('state').innerHTML = userLoggedIn.user.state;
        document.getElementById('country').innerHTML = userLoggedIn.user.country;
        document.getElementById('postalCode').innerHTML = userLoggedIn.user.postalCode;
        document.getElementById('nameOnCard').innerHTML = userLoggedIn.user.nameOnCard;
        document.getElementById('cardNumber').innerHTML = userLoggedIn.user.cardNumber;
        document.getElementById('cvv').innerHTML = userLoggedIn.user.cvv;
        document.getElementById('expiryDate').innerHTML = userLoggedIn.user.expiryDate;

        document.getElementById('editUsername').value = userLoggedIn.username;
        document.getElementById('editEmail').value = userLoggedIn.email;
        document.getElementById('editAddress').value = userLoggedIn.user.billingAddress;
        document.getElementById('editCity').value = userLoggedIn.user.city;
        document.getElementById('editState').value = userLoggedIn.user.state;
        document.getElementById('editCountry').value = userLoggedIn.user.country;
        document.getElementById('editPostalCode').value = userLoggedIn.user.postalCode;
        document.getElementById('editNameOnCard').value = userLoggedIn.user.nameOnCard;
        document.getElementById('editCardNumber').value = userLoggedIn.user.cardNumber;
        document.getElementById('editCvv').value = userLoggedIn.user.cvv;
        document.getElementById('editExpiryDate').value = userLoggedIn.user.expiryDate;

        const users = await getUserList();
        loadUsersContainer(users);
        updateUserUI(userLoggedIn);
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', () => performUserSearch(users));
    }
    const editUsernameButton = document.getElementById('editUsernameButton');
    const editFormContainer = document.getElementById('editFormModal');

    editUsernameButton.addEventListener('click', () => {
        editFormContainer.style.display = 'block';
        document.getElementById('editUsername').focus();
        handleProfileEditButton();

    });
    const span = document.getElementsByClassName("editClose")[0];
    span.onclick = function () {
        editFormContainer.style.display = "none";
    }
    window.editUser = function () {
        document.getElementById('editUserId').value = userLoggedIn.user._id;
        document.getElementById('editUserUsername').value = userLoggedIn.username;
        document.getElementById('editUserEmail').value = userLoggedIn.email;


    };

    const closeEditModalSpan = document.getElementsByClassName("adminEditClose")[0];
    closeEditModalSpan.onclick = function () {
        document.getElementById('adminEditModal').style.display = "none";
    }

    window.onclick = function (event) {
        const editModal = document.getElementById('adminEditModal');
        if (event.target == editModal) {
            editModal.style.display = "none";
        }
    }

    const editButtons = document.querySelectorAll('.edit-user-button');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.getAttribute('data-user-id');
            editUser(userId);
        });
    });


    window.onclick = function (event) {
        const editUserModal = document.getElementById('editUserModal');
        if (event.target == editUserModal) {
            editUserModal.style.display = 'none';
        }
    }

    const profileForm = document.getElementById('editProfileForm');
    profileForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const newUserInfo = {
            username: document.getElementById('editUsername').value,
            email: document.getElementById('editEmail').value,
            billingAddress: document.getElementById('editAddress').value,
            city: document.getElementById('editCity').value,
            state: document.getElementById('editState').value,
            country: document.getElementById('editCountry').value,
            postalCode: document.getElementById('editPostalCode').value,
            nameOnCard: document.getElementById('editNameOnCard').value,
            cardNumber: document.getElementById('editCardNumber').value,
            cvv: document.getElementById('editCvv').value,
            expiryDate: document.getElementById('editExpiryDate').value,
        }
        try {
            const response = await updateProfile(JSON.stringify(newUserInfo))

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
        const btnSearch = document.getElementById("search-container-orders");
        btnSearch.style.display = "block";
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
        const userDiv = document.getElementById('adminUserList');
        userDiv.style.display = "block";
    }

    const orders = await getOrders(userLoggedIn.user);
    const searchButton = document.getElementById('searchButtonOrders');
    searchButton.addEventListener('click', () => {
        const newOrders = searchOrdersByUsername(orders);
        const ordersDiv = document.getElementById("orders-container");
        ordersDiv.innerHTML = '';
        displayOrderDetails(newOrders, userLoggedIn.email);
    });

    await displayOrderDetails(orders, userLoggedIn.email);
});
async function getUserList() {
    const response = await fetch('/api/users');
    const users = await response.json();
    return users;
}

async function fetchUsersAndCreateButtons() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        const modalBody = document.getElementById('admin-edit-form');

        users.forEach(user => {
            const userContainer = document.createElement('div');
            userContainer.classList.add('user-container');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-user-button';
            editButton.setAttribute('data-user-id', user._id);

            userContainer.appendChild(editButton);
            modalBody.appendChild(userContainer);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
function loadUsersContainer(users) {
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-entry';
        userDiv.innerHTML = `
            <strong>Username:</strong> ${user.username}<br>
            <strong>Email:</strong> ${user.email}<br>
            <hr>
        `;
        userListDiv.appendChild(userDiv);
    });
}
function performUserSearch(usersList) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const filteredUsers = usersList.filter(user =>
        user.username.toLowerCase().includes(searchInput) ||
        user.email.toLowerCase().includes(searchInput)
    );

    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = '';

    loadUsersContainer(filteredUsers);
}


function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-user-button');

    if (editButtons.length === 0) {
        console.error('No edit buttons found!');
        return;
    }

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.getAttribute('data-user-id');
            editUser(userId);
        });
    });
}

function handleProfileEditButton() {
    const editUsernameButton = document.getElementById('editUsernameButton');
    const editFormContainer = document.getElementById('editFormModal');

    editUsernameButton.addEventListener('click', () => {
        editFormContainer.style.display = 'block';
        document.getElementById('editUsername').focus();
    });

    const span = document.getElementsByClassName("editClose")[0];
    span.onclick = function () {
        editFormContainer.style.display = "none";
    }
}

function updateUserUI(userLoggedIn) {
    document.getElementById('username').innerHTML = userLoggedIn.username;
    document.getElementById('email').innerHTML = userLoggedIn.email;
    document.getElementById('address').innerHTML = userLoggedIn.user.billingAddress;
    document.getElementById('city').innerHTML = userLoggedIn.user.city;
    document.getElementById('state').innerHTML = userLoggedIn.user.state;
    document.getElementById('country').innerHTML = userLoggedIn.user.country;
    document.getElementById('postalCode').innerHTML = userLoggedIn.user.postalCode;
    document.getElementById('nameOnCard').innerHTML = userLoggedIn.user.nameOnCard;
    document.getElementById('cardNumber').innerHTML = userLoggedIn.user.cardNumber;
    document.getElementById('cvv').innerHTML = userLoggedIn.user.cvv;
    document.getElementById('expiryDate').innerHTML = userLoggedIn.user.expiryDate;

    document.getElementById('editUsername').value = userLoggedIn.username;
    document.getElementById('editEmail').value = userLoggedIn.email;
    document.getElementById('editAddress').value = userLoggedIn.user.billingAddress;
    document.getElementById('editCity').value = userLoggedIn.user.city;
    document.getElementById('editState').value = userLoggedIn.user.state;
    document.getElementById('editCountry').value = userLoggedIn.user.country;
    document.getElementById('editPostalCode').value = userLoggedIn.user.postalCode;
    document.getElementById('editNameOnCard').value = userLoggedIn.user.nameOnCard;
    document.getElementById('editCardNumber').value = userLoggedIn.user.cardNumber;
    document.getElementById('editCvv').value = userLoggedIn.user.cvv;
    document.getElementById('editExpiryDate').value = userLoggedIn.user.expiryDate;
}
