export function getFilter(productsList) {
    const filters = [];
    const allPublishers = [];
    const allCategories = [];
    productsList.forEach(product => {
        if (!allPublishers.some(item => item.optionName === product.publisher)) {
            allPublishers.push({ optionName: product.publisher });
        }
        if (!allCategories.some(item => item.optionName === product.category)) {
            allCategories.push({ optionName: product.category });
        }
    });
    filters.push(
        {
            filterName: 'Category',
            filterOptions: allCategories,
        },
        {
            filterName: 'Publisher',
            filterOptions: allPublishers,
        },
        {
            filterName: 'Name Sorting',
            filterOptions: [
                { optionName: 'Name (A-Z)', type: 'radio', name: 'sortBy' },
                { optionName: 'Name (Z-A)', type: 'radio', name: 'sortBy' },
            ]
        },
        {
            filterName: 'Price Sorting',
            filterOptions: [
                { optionName: 'Price (ASC)', type: 'radio', name: 'sortBy' },
                { optionName: 'Price (DESC)', type: 'radio', name: 'sortBy' },
            ]
        });
    return filters;
};

export function sortBy(array, criteria) {
    if (criteria === 'Name (A-Z)') {
        array.sort((a, b) => a.product_name.localeCompare(b.product_name));
    } else if (criteria === 'Name (Z-A)') {
        array.sort((a, b) => b.product_name.localeCompare(a.product_name));
    } else if (criteria === 'Price (ASC)') {
        array.sort((a, b) => a.price - b.price);
    } else if (criteria === 'Price (DESC)') {
        array.sort((a, b) => b.price - a.price);
    }
    return array;
}

export function searchGamesByKeyWord(gameList) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    // Filter the games based on the search input
    const filteredGames = gameList.filter(game =>
        game.product_name.toLowerCase().includes(searchInput) ||
        game.publisher.toLowerCase().includes(searchInput) ||
        game.category.toLowerCase().includes(searchInput)
    );
    return filteredGames;
}

export function searchOrdersByUsername(orderList, userEmail) {
    const searchInput = document.getElementById('searchInputOrders').value.toLowerCase();

    const filteredOrders = orderList.filter(order =>
        order.user.username.toLowerCase().includes(searchInput) ||
        order.user.email.toLowerCase().includes(searchInput)
    );

    const ordersDiv = document.getElementById("orders-container");
    ordersDiv.innerHTML = '';
    displayOrderDetails(filteredOrders, userEmail);
}
