// const User = require("../Model/userModel");
async function getGameList() {
    try {
        const response = await fetch('api/product');
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function getFilter(productsList) {
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
            filterName: 'Sort By',
            filterOptions: [
                { optionName: 'Name (A-Z)' },
                { optionName: 'Name (Z-A)' },
                { optionName: 'Price (ASC)' },
                { optionName: 'Price (DESC)' },
            ]
        });
    return filters;
};

function sortBy(array, criteria) {
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

async function isUserLoggedIn() {
    try {
        const response = await fetch('/api/checkLogin');
        const data = await response.json();
        return data.isLoggedIn;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

//initialize the cart array

// test
async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        cart = data.cart;
        if (window.location.pathname !== '/checkoutPage.html') {
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function addToCart(productName) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productName, quantity: 1 }),
        });
        const userLoggedIn = await isUserLoggedIn();
        if (!userLoggedIn) {
            window.location.href = '/signinPage';
            return;
        }
        if (response.ok) {
            const data = await response.json();
            cart = data.cart;
            updateCartDisplay();
        } else {
            const error = await response.json();
            console.error('Error adding to cart:', error);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

async function removeFromCart(productName) {
    try {
        const response = await fetch('/api/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productName }),
        });

        if (response.ok) {
            const data = await response.json();
            cart = data.cart;
            updateCartDisplay();
        } else {
            const error = await response.json();
            console.error('Error removing from cart:', error);
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.product.product_name} - $${item.product.price} x ${item.quantity} = $${item.product.price * item.quantity} `;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.product.product_name);
        itemElement.appendChild(removeButton);
        cartContainer.appendChild(itemElement);
        totalPrice += item.product.price * item.quantity;
    });

    const totalPriceDiv = document.createElement('div');
    totalPriceDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    cartContainer.appendChild(totalPriceDiv);

    const cartImage = document.getElementById('shoppingCartIcon');
    cartImage.src = cart.length > 0 ? '/images/shoppingCartFull.png' : '/images/shoppingCartEmpty.png';
}

// GAME PAGE
const loadGamesContainer = (displayedGames) => {
    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games';
    displayedGames.forEach(game => {
        const gamesDiv = document.createElement('div');
        const gamesImageContainer = document.createElement('div');
        gamesImageContainer.className = 'gamePicDiv';
        const gamesImage = document.createElement('img');
        gamesImage.src = game.image_url;
        gamesImage.className = 'gamePic';
        gamesImageContainer.appendChild(gamesImage);
        gamesDiv.appendChild(gamesImageContainer);

        const gamesDesc = document.createElement('div');
        gamesDesc.className = 'gameDesc';
        const gameName = document.createElement('div');
        gameName.className = 'gameName';
        gameName.textContent = game.product_name;
        gamesDesc.appendChild(gameName);

        const gamePublisher = document.createElement('div');
        gamePublisher.textContent = game.publisher;
        gamesDesc.appendChild(gamePublisher);

        const avalableInStock = document.createElement('div');
        avalableInStock.textContent = `Available in stock: ${game.quantity_in_stock}`;
        gamesDesc.appendChild(avalableInStock);

        const gamePrice = document.createElement('div');
        gamePrice.textContent = '$' + game.price;
        gamePrice.className = 'gamePrice';
        gamesDesc.appendChild(gamePrice);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.onclick = () => {
            addToCart(game.product_name, displayedGames);
        };
        gamesDesc.appendChild(addButton);

        gamesDiv.appendChild(gamesDesc);
        gamesContainer.appendChild(gamesDiv);
    });
    return gamesContainer;
};
async function updateShoppingPage() {
    const cartModal = document.getElementById("cartModal");
    const cartButton = document.getElementById("cartButton");
    const cartSpan = document.getElementsByClassName("close")[0];

    const userLoggerIn = await isUserLoggedIn();

    cartButton.onclick = () => {
        if (userLoggerIn) {
            cartModal.style.display = "block";
        } else {
            window.location.href = '/signinPage';
            return;
        }
    }
    cartSpan.onclick = () => {
        cartModal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
        }
    }
    const checkoutButton = document.getElementById("checkoutButton");
    if (checkoutButton) {
        checkoutButton.onclick = () => {
            window.location.href = "/checkoutPage.html";
        };
    }

    const gameList = await getGameList();
    const homeContainer = document.createElement('div');
    homeContainer.className = 'homeContainer';
    const title = document.createElement('div');
    title.textContent = 'Game Catalogue';
    title.className = 'homepageTitle';
    document.body.appendChild(title);
    let displayedGames = gameList;

    // LOAD FILTERS
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filters';
    const selectedFilters = [];
    const filterList = getFilter(gameList);
    filterList.forEach(filter => {
        // general container for filters
        const filterDiv = document.createElement('div');
        filterDiv.className = 'filterDiv';
        // container for the name of the filter
        const filterDivText = document.createElement('div');
        filterDivText.className = 'filterDivText';
        filterDivText.textContent = filter.filterName;
        filterDiv.appendChild(filterDivText);
        // dropdown list
        const filterOptions = document.createElement('div');
        filterOptions.className = 'filterOptions'
        filter.filterOptions.forEach((option) => {
            const filterOptionText = document.createElement('label');
            const filterOption = document.createElement('input');
            filterOption.type = "checkbox";
            filterOption.value = option.optionName;
            filterOption.className = 'filterOption'
            filterOptionText.appendChild(filterOption);
            filterOptionText.appendChild(document.createTextNode(option.optionName));
            filterOptions.appendChild(filterOptionText);
            filterOptions.appendChild(document.createElement("br"));
            filterOption.addEventListener("change", () => {
                if (filterOption.checked) {
                    selectedFilters.push(option.optionName);
                } else {
                    const index = selectedFilters.indexOf(option.optionName);
                    if (index !== -1) {
                        selectedFilters.splice(index, 1);
                    }
                }
            });
        });
        const plusSign = document.createElement('button');
        plusSign.textContent = '+';
        plusSign.className = 'filterPlusButton'
        plusSign.addEventListener("click", () => {
            if (plusSign.textContent === '+') {
                plusSign.textContent = '–';
                filterOptions.style.display = "block";
            } else {
                plusSign.textContent = '+';
                filterOptions.style.display = "none";
            }
        });
        filterDiv.appendChild(plusSign);
        filterContainer.appendChild(filterDiv);
        filterContainer.appendChild(filterOptions);
    });
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Apply Filters';
    confirmButton.className = 'confirmButton'
    confirmButton.addEventListener("click", () => {
        const existingGamesContainer = document.querySelector('.games');
        if (existingGamesContainer) {
            existingGamesContainer.remove();
        }
        displayedGames = gameList.filter((game) => {
            const nonSortingFilters = selectedFilters.filter((filter) => filter !== 'Name (A-Z)' &&
                filter !== 'Name (Z-A)' &&
                filter !== 'Price (ASC)' &&
                filter !== 'Price (DESC)')
            if (nonSortingFilters.length !== 0) {
                return nonSortingFilters.some((filter) => filter == game.publisher
                    || filter == game.genre || filter == game.category);
            }
            return true;
        });

        const sortFilter = selectedFilters.find(filter =>
            filter === 'Name (A-Z)' ||
            filter === 'Name (Z-A)' ||
            filter === 'Price (ASC)' ||
            filter === 'Price (DESC)');
        if (sortFilter) {
            displayedGames = sortBy(displayedGames, sortFilter);
        }

        const newGamesContainer = loadGamesContainer(displayedGames);
        homeContainer.appendChild(newGamesContainer);
    });
    filterContainer.appendChild(confirmButton);
    homeContainer.appendChild(filterContainer);

    const gamesContainer = loadGamesContainer(gameList);
    homeContainer.appendChild(gamesContainer);

    document.body.appendChild(homeContainer);
};

// CHECKOUT PAGE

async function getUserInfo() {
    try {
        const response = await fetch('/api/checkLogin');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
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
        }
    }
    document.getElementById('payment-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData.entries());

        const combinedData = {
            ...formValues,
            userEmail: userInfo.email,
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
            const orderPlacement = await fetch('api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedData),
            });
            if (orderPlacement.ok) {
                window.alert('Order placed, thank you! You will be redirected to your profile now. You will see your order there.')
                window.location.href = '/profile';
            } else {
                console.log(orderPlacement.error);
            }
        }
    });
};


// PAGES LOAD
document.addEventListener('DOMContentLoaded', async () => {
    updateUserStatus();
    await loadCart();

    if (window.location.pathname === '/checkoutPage.html') {
        updateCheckoutPage();
    } else {
        updateShoppingPage();
    }
});

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


