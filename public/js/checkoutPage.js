import { getUserInfo, updateProfile, placeOrder, getCart, updateUserStatus } from './apiRequests.js';

let cart = [];
async function loadCart() {
    try {
        const response = await getCart();
        cart = response.cart;
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function updateCheckoutPage() {
    const userInfo = await getUserInfo();
    const cartSummary = document.getElementById('cartSummary');

    if (!userInfo.isLoggedIn) {
        window.location.href = '/signinPage';
        return;
    }

    let totalPrice = 0.0;
    if (cartSummary) {
        cartSummary.innerHTML = '';
        if (cart.length === 0) {
            cartSummary.textContent = "Your cart is empty.";
            window.alert("Your cart is empty. Add something before checking out.");
            window.location.href = '/shoppingPage';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.textContent = `${item.product.product_name} - $${item.product.price} x ${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`;
                cartSummary.appendChild(itemElement);
                totalPrice += item.product.price * item.quantity;
            });

            const totalElement = document.createElement('div');
            totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
            cartSummary.appendChild(totalElement);
            populateFormWithUserInfo(userInfo.user);
        }
    }

    document.getElementById('payment-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData.entries());

        const combinedData = {
            ...formValues,
            userId: userInfo.user._id,
            cart: cart,
            totalPrice: totalPrice,
        };

        let stockError = 'There was an error with placing your order: \n';
        let outOfStockError = false;
        cart.forEach(item => {
            if (item.product.quantity_in_stock - item.quantity < 0) {
                outOfStockError = true;
                stockError += `${item.product.product_name} is not available in this quantity. Current stock quantity: ${item.product.quantity_in_stock}.\n`;
            }
        });

        if (outOfStockError) {
            stockError += "Please, adjust your order accordingly."
            window.alert(stockError);
            window.location.href = '/shoppingPage';
        } else {
            await fetch('api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cart),
            });
            let newUserInfo = '';
            if (needsProfileUpdate(userInfo.user, formValues)) {
                const newUserData = JSON.stringify({
                    userId: userInfo.user._id,
                    email: userInfo.user.email,
                    billingAddress: formValues.billingAddress,
                    city: formValues.city,
                    state: formValues.state,
                    country: formValues.country,
                    postalCode: formValues.postalCode,
                    nameOnCard: formValues.name,
                    cardNumber: formValues.cardNumber,
                    cvv: formValues.cvv,
                    expiryDate: formValues.expiryDate,
                });
                const response = await updateProfile(newUserData);
                if (response.ok) {
                    newUserInfo = '\n\nYour new payment information was saved.';
                }
            }
            const orderPlacement = await placeOrder(combinedData);
            if (orderPlacement.ok) {
                cart = [];
                await loadCart();
                window.alert('Order placed, thank you! You will be redirected to your profile now. You will see your order there.' + newUserInfo);
                window.location.href = '/profile';
            } else {
                console.error(orderPlacement.error);
            }
        }
    });
}

function populateFormWithUserInfo(user) {
    document.getElementById('billingAddress').value = user.billingAddress;
    document.getElementById('city').value = user.city;
    document.getElementById('state').value = user.state;
    document.getElementById('country').value = user.country;
    document.getElementById('postalCode').value = user.postalCode;
    document.getElementById('name').value = user.nameOnCard;
    document.getElementById('cardNumber').value = user.cardNumber;
    document.getElementById('cvv').value = user.cvv;
    document.getElementById('expiryDate').value = user.expiryDate;
}

function needsProfileUpdate(user, formValues) {
    return user.billingAddress !== formValues.billingAddress ||
        user.city !== formValues.city ||
        user.state !== formValues.state ||
        user.country !== formValues.country ||
        user.postalCode !== formValues.postalCode ||
        user.nameOnCard !== formValues.name ||
        user.cvv !== formValues.cvv ||
        user.expiryDate !== formValues.expiryDate ||
        user.cardNumber !== formValues.cardNumber;
}

// PAGES LOAD
document.addEventListener('DOMContentLoaded', async () => {
    updateUserStatus();
    await loadCart();
    updateCheckoutPage();
});