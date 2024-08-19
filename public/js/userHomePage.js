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
            if (data.isAdmin || data.email === 'admin@gmail.com') { //added when admin can only edit users info
                document.getElementById('adminEditButton').style.display = 'block';
                document.getElementById('adminStockButton').style.display = 'block';
            } else {
                document.getElementById('adminEditButton').style.display = 'none';
                document.getElementById('adminStockButton').style.display = 'none';
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
    const editUsernameButton = document.getElementById('editUsernameButton'); //editing the user and email
    const editFormContainer = document.getElementById('editFormModal');

    editUsernameButton.addEventListener('click', () => {
        editFormContainer.style.display = 'block';
        document.getElementById('editUsername').focus();
    });
    const span = document.getElementsByClassName("editClose")[0];
    span.onclick = function () {
        editFormContainer.style.display = "none";
    }
    window.editUser = function(userId) {
        console.log('Editing user:', userId); // Debugging line
    //    // fetch(`/api/users/${userId}`)
    //         .then(response => response.json())
    //         .then(user => {
    //             // Populate the modal with the user data
    //             document.getElementById('editUserId').value = user._id;
    //             document.getElementById('editUserUsername').value = user.username;
    //             document.getElementById('editUserEmail').value = user.email;
    
    //             // Display the modal
    //             const editUserModal = document.getElementById('editUserModal');
    //             editUserModal.style.display = 'block';
    // //         })
    //         .catch(error => console.error('Error fetching user:', error));

    document.getElementById('editUserId').value = user._id;
    document.getElementById('editUserUsername').value = user.username;
                document.getElementById('editUserEmail').value = user.email;


 };
 document.getElementById('adminEditButton').addEventListener('click', () => {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const modalBody = document.getElementById('admin-edit-form');
            modalBody.innerHTML = ''; // Clear previous content

            users.forEach(user => {
                // Username label and input
                const userLabel = document.createElement('label');
                userLabel.setAttribute('for', `username${user._id}`);
                userLabel.textContent = `Username: `;
                
                const userInput = document.createElement('input');
                userInput.setAttribute('type', 'text');
                userInput.setAttribute('id', `username${user._id}`);
                userInput.setAttribute('name', `username`);
                userInput.setAttribute('value', user.username);
                
                // Address label and input
                const addressLabel = document.createElement('label');
                addressLabel.setAttribute('for', `address${user._id}`);
                addressLabel.textContent = `Address: `;
                
                const addressInput = document.createElement('input');
                addressInput.setAttribute('type', 'text');
                addressInput.setAttribute('id', `address${user._id}`);
                addressInput.setAttribute('name', `address`);
                addressInput.setAttribute('value', user.billingAddress);
                
                // City label and input
                const cityLabel = document.createElement('label');
                cityLabel.setAttribute('for', `city${user._id}`);
                cityLabel.textContent = `City: `;
                
                const cityInput = document.createElement('input');
                cityInput.setAttribute('type', 'text');
                cityInput.setAttribute('id', `city${user._id}`);
                cityInput.setAttribute('name', `city`);
                cityInput.setAttribute('value', user.city);
                
                // State label and input
                const stateLabel = document.createElement('label');
                stateLabel.setAttribute('for', `state${user._id}`);
                stateLabel.textContent = `State: `;
                
                const stateInput = document.createElement('input');
                stateInput.setAttribute('type', 'text');
                stateInput.setAttribute('id', `state${user._id}`);
                stateInput.setAttribute('name', `state`);
                stateInput.setAttribute('value', user.state);
                
                // Country label and input
                const countryLabel = document.createElement('label');
                countryLabel.setAttribute('for', `country${user._id}`);
                countryLabel.textContent = `Country: `;
                
                const countryInput = document.createElement('input');
                countryInput.setAttribute('type', 'text');
                countryInput.setAttribute('id', `country${user._id}`);
                countryInput.setAttribute('name', `country`);
                countryInput.setAttribute('value', user.country);
                
                // Postal Code label and input
                const postalCodeLabel = document.createElement('label');
                postalCodeLabel.setAttribute('for', `postalCode${user._id}`);
                postalCodeLabel.textContent = `Postal Code: `;
                
                const postalCodeInput = document.createElement('input');
                postalCodeInput.setAttribute('type', 'text');
                postalCodeInput.setAttribute('id', `postalCode${user._id}`);
                postalCodeInput.setAttribute('name', `postalCode`);
                postalCodeInput.setAttribute('value', user.postalCode);
                
                // Card Information
                const nameOnCardLabel = document.createElement('label');
                nameOnCardLabel.setAttribute('for', `nameOnCard${user._id}`);
                nameOnCardLabel.textContent = `Name on Card: `;
                
                const nameOnCardInput = document.createElement('input');
                nameOnCardInput.setAttribute('type', 'text');
                nameOnCardInput.setAttribute('id', `nameOnCard${user._id}`);
                nameOnCardInput.setAttribute('name', `nameOnCard`);
                nameOnCardInput.setAttribute('value', user.nameOnCard);
                
                const cardNumberLabel = document.createElement('label');
                cardNumberLabel.setAttribute('for', `cardNumber${user._id}`);
                cardNumberLabel.textContent = `Card Number: `;
                
                const cardNumberInput = document.createElement('input');
                cardNumberInput.setAttribute('type', 'text');
                cardNumberInput.setAttribute('id', `cardNumber${user._id}`);
                cardNumberInput.setAttribute('name', `cardNumber`);
                cardNumberInput.setAttribute('value', user.cardNumber);
                cardNumberInput.setAttribute('inputmode', 'numeric');
                cardNumberInput.setAttribute('pattern', '[0-9\\s]{13,19}');
                cardNumberInput.setAttribute('maxlength', '19');
                
                const cvvLabel = document.createElement('label');
                cvvLabel.setAttribute('for', `cvv${user._id}`);
                cvvLabel.textContent = `CVV: `;
                
                const cvvInput = document.createElement('input');
                cvvInput.setAttribute('type', 'text');
                cvvInput.setAttribute('id', `cvv${user._id}`);
                cvvInput.setAttribute('name', `cvv`);
                cvvInput.setAttribute('value', user.cvv);
                cvvInput.setAttribute('inputmode', 'numeric');
                cvvInput.setAttribute('pattern', '[0-9]{3}');
                cvvInput.setAttribute('maxlength', '3');
                
                const expiryDateLabel = document.createElement('label');
                expiryDateLabel.setAttribute('for', `expiryDate${user._id}`);
                expiryDateLabel.textContent = `Expiry Date: `;
                
                const expiryDateInput = document.createElement('input');
                expiryDateInput.setAttribute('type', 'text');
                expiryDateInput.setAttribute('id', `expiryDate${user._id}`);
                expiryDateInput.setAttribute('name', `expiryDate`);
                expiryDateInput.setAttribute('value', user.expiryDate);
                
                // Append to modal body
                modalBody.appendChild(userLabel);
                modalBody.appendChild(userInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(addressLabel);
                modalBody.appendChild(addressInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(cityLabel);
                modalBody.appendChild(cityInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(stateLabel);
                modalBody.appendChild(stateInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(countryLabel);
                modalBody.appendChild(countryInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(postalCodeLabel);
                modalBody.appendChild(postalCodeInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(nameOnCardLabel);
                modalBody.appendChild(nameOnCardInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(cardNumberLabel);
                modalBody.appendChild(cardNumberInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(cvvLabel);
                modalBody.appendChild(cvvInput);
                modalBody.appendChild(document.createElement('br'));
                modalBody.appendChild(expiryDateLabel);
                modalBody.appendChild(expiryDateInput);
                modalBody.appendChild(document.createElement('br'));
            });

            // Save Changes button
            const saveButton = document.createElement('button');
            saveButton.setAttribute('type', 'submit');
            saveButton.textContent = 'Save Changes';
            saveButton.className = 'edit-button';
            saveButton.id = 'saveEditButton';
            modalBody.appendChild(saveButton);

            // Event listener for submitting the form
            document.getElementById('admin-edit-form').addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(event.target);
                const formValues = Object.fromEntries(formData.entries());
                const values = {
                    values: Object.entries(formValues).map(([key, value]) => ({
                        user_id: key,
                        updated_value: value,
                    }))
                };
                const updateUser = await fetch('/api/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                if (updateUser.ok) {
                    window.alert('User information updated successfully');
                    window.location.href = '/profile';
                } else {
                    window.alert(`Update Failed: ${updateUser.error}`);
                }
            });

            // Show the modal
            const editModal = document.getElementById('adminEditModal');
            editModal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching users:', error));
});

// Close the modal when the 'x' is clicked
const closeEditModalSpan = document.getElementsByClassName("adminEditClose")[0];
closeEditModalSpan.onclick = function () {
    document.getElementById('adminEditModal').style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
    const editModal = document.getElementById('adminEditModal');
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}



    
       
    
    console.log('Attaching event listeners to edit buttons');

    const editButtons = document.querySelectorAll('.edit-user-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Edit button clicked');
            alert('Edit button clicked');  // Just for testing
            const userId = event.target.getAttribute('data-user-id');
            console.log('Editing user with ID:', userId);
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
        const updatedUsername = document.getElementById('editUsername').value;
        const updatedEmail = document.getElementById('editEmail').value;
        const updatedAddress = document.getElementById('editAddress').value;
        const updatedCity = document.getElementById('editCity').value;
        const updatedState = document.getElementById('editState').value;
        const updatedCountry = document.getElementById('editCountry').value;
        const updatedPostalCode = document.getElementById('editPostalCode').value;
        const updatedNameOnCard = document.getElementById('editNameOnCard').value;
        const updatedCardNumber = document.getElementById('editCardNumber').value;
        const updatedCvv = document.getElementById('editCvv').value;
        const updatedExpiryDate = document.getElementById('editExpiryDate').value;

        try {
            const response = await fetch('/api/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: updatedUsername,
                    email: updatedEmail,
                    billingAddress: updatedAddress,
                    city: updatedCity,
                    state: updatedState,
                    country: updatedCountry,
                    postalCode: updatedPostalCode,
                    nameOnCard: updatedNameOnCard,
                    cardNumber: updatedCardNumber,
                    cvv: updatedCvv,
                    expiryDate: updatedExpiryDate,
                })
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
        const userDiv = document.getElementById('adminUserList');
        userDiv.style.display = "block";
        const allUsersBody = await fetch('/api/users');
        const allUsers = await allUsersBody.json();
        allUsers.forEach(user => {
            if (!user.isAdmin) {
                const userInfo = document.createElement('div');
                userInfo.innerHTML = `
                    <strong>Username:</strong> ${user.username}<br>
                    <strong>Email:</strong> ${user.email}<br>
                    <hr>`;
                userDiv.append(userInfo);
            }
        });
        
        
        
    }
    document.getElementById('editUserForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const updatedUsername = document.getElementById('editUserUsername').value;
        const updatedEmail = document.getElementById('editUserEmail').value;
        
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: updatedUsername,
                    email: updatedEmail,
                })
            });
    
            if (response.ok) {
                alert('User information updated successfully!');
                document.getElementById('editUserModal').style.display = 'none';
                window.location.reload();  // Reload the page to reflect the changes
            } else {
                alert('Failed to update user information.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    });
    
    

    
    await displayOrderDetails(userLoggedIn);
});