export const fetchData = async (route) => {
    const response = await fetch(route);
    if (!response.ok) {
        throw new Error(response.error);
    }
    return response.json();
  }

  export async function getGameList() {
    try {
        const items = await fetchData('api/product');
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
  }

export async function getCart() {
    try {
        return await fetchData('/api/cart');
    } catch (error) {
        console.error('Error loading cart:', error);
        return { cart: [] };
    }
}

export async function cartAdd(productName) {
    try {
        return await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productName, quantity: 1 }),
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

export async function cartRemove(productName) {
    try {
        return await fetch('/api/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productName }),
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

export async function getUserInfo() {
    try {
        return await fetchData('/api/checkLogin');
    } catch (error) {
        console.error('Error checking login status:', error);
        return {};
    }
}

export async function updateProfile(userInfo) {
    try {
        return await fetch('/api/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userInfo,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

export async function placeOrder(orderData) {
    try {
        return await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
    } catch (error) {
        console.error('Error placing order:', error);
    }
}

export async function isUserLoggedIn() {
    try {
        const data = await fetchData('/api/checkLogin');
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

export async function updateUserStatus() {
    try {
        const userInfo = await isUserLoggedIn();

        const userStatusDiv = document.getElementById('login-block');
        if (userInfo.isLoggedIn) {
            userStatusDiv.innerHTML = `
                <span>Hello, ${userInfo.username}</span> 
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

// api.js

export async function checkLogin() {
    try {
        const response = await fetch('/api/checkLogin');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error checking login status:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.ok;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}

export async function getOrders(user) {
    try {
        console.log(user);
        const url = user.isAdmin ? '/api/orders' : `/api/orders/${user._id}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function getUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function updateProductStock(stockData) {
    try {
        const response = await fetch('/api/product', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stockData)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.ok;
    } catch (error) {
        console.error('Error updating product stock:', error);
        throw error;
    }
}
