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
