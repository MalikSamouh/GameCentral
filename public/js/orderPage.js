async function getOrders(userType) {
    let orders = [];
    if (userType === 'admin') {
        orders = await fetch('/api/orders');
    } else {
        // retrieve user id somehow
        orders = await fetch(`/api/orders/${userId}`);
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

async function displayOrderDetails() {
    const detailsDiv = document.getElementById('fromJS');
    const orders = await getOrders('admin');
    const ordersContainer = document.createElement('div');
    orders.forEach(order => {
        const orderContainer = document.createElement('div');
        orderContainer.innerHTML = `
            <strong>Description:</strong> ${order.description}<br>
            <strong>Status:</strong> ${order.status}
        `;
        ordersContainer.appendChild(orderContainer);
    });
    detailsDiv.append(ordersContainer);
    // TODO: test
}

window.onload = await displayOrderDetails();
