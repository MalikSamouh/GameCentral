import { getCart, cartAdd, cartRemove, isUserLoggedIn, getGameList, getUserInfo, updateProfile, placeOrder } from './apiRequests.js';

let cart = [];

// const User = require("../Model/userModel");

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

//initialize the cart array

async function loadCart() {
    try {
        const response = await getCart();
        cart = response.cart;
        if (window.location.pathname !== '/checkoutPage.html') {
            updateCartDisplay();
        }
        updateCartCount(); 
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function addToCart(productName) {
    try {
        const response = await cartAdd(productName);
        const userLoggedIn = await isUserLoggedIn();
        if (!userLoggedIn) {
            window.location.href = '/signinPage';
            return;
        }
        if (response.ok) {
            const data = await response.json();
            cart = data.cart;
            updateCartDisplay();

            showPopup(`${productName} added to cart!`);
            updateCartCount();
        } else {
            const error = await response.json();
            console.error('Error adding to cart:', error);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) {
        const cartButton = document.getElementById('cartButton');
        const newCartCount = document.createElement('span');
        newCartCount.id = 'cartCount';
        newCartCount.style.backgroundColor = 'red';
        newCartCount.style.color = 'white';
        newCartCount.style.borderRadius = '50%';
        newCartCount.style.padding = '2px 6px';
        newCartCount.style.position = 'absolute';
        newCartCount.style.top = '0';
        newCartCount.style.right = '0';
        cartButton.style.position = 'relative';
        cartButton.appendChild(newCartCount);
    }
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.backgroundColor = '#4CAF50';
    popup.style.color = 'white';
    popup.style.padding = '15px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    document.body.appendChild(popup);

    // Remove popup after 3 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}

async function removeFromCart(productName) {
    try {
        const response = await cartRemove(productName);
        if (response.ok) {
            const data = await response.json();
            cart = data.cart;
            updateCartDisplay();
            updateCartCount();

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
    const totalPriceDiv = document.getElementById('totalPriceDiv');
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.style.display = 'flex'; 
        itemElement.style.justifyContent = 'space-between'; 
        itemElement.style.justifyContent = 'space-between'; 
        itemElement.style.alignItems = 'center'; 
        itemElement.style.marginBottom = '10px';

        const itemText = document.createElement('span');
        itemText.textContent = `${item.product.product_name} - $${item.product.price} x ${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px'; 
        removeButton.onclick = () => removeFromCart(item.product.product_name);

        itemElement.appendChild(itemText);
        itemElement.appendChild(removeButton);
        cartContainer.appendChild(itemElement);

        totalPrice += item.product.price * item.quantity;
    });

    totalPriceDiv.innerHTML = `<strong>Total Price: $${totalPrice.toFixed(2)}</strong>`;

    const cartImage = document.getElementById('shoppingCartIcon');
    cartImage.src = cart.length > 0 ? '/images/shoppingCartFull.png' : '/images/shoppingCartEmpty.png';
    updateCartCount();
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
    const searchContainer = document.createElement('div'); //create a search bar
    searchContainer.className = 'searchContainer';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search games...';
    searchInput.id = 'searchInput';

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.className = 'searchButton';
    searchButton.onclick = () => searchGamesByKeyWord(gameList);

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);

    let displayedGames = gameList;

    // LOAD FILTERS
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filters';
    filterContainer.appendChild(searchContainer); //append search
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
            filterOption.type = option.type || "checkbox";
            filterOption.name = option.name || '';
            filterOption.value = option.optionName;
            filterOption.className = 'filterOption';

            filterOptionText.appendChild(filterOption);
            filterOptionText.appendChild(document.createTextNode(option.optionName));
            filterOptions.appendChild(filterOptionText);
            filterOptions.appendChild(document.createElement("br"));
            filterOption.addEventListener("change", () => {
                if (filter.filterName === 'Sort By') {
                    if (filterOption.checked) {
                        selectedFilters.push(option.optionName);
                    }
                } else {
                    if (filterOption.checked) {
                        selectedFilters.push(option.optionName);
                    } else {
                        const index = selectedFilters.indexOf(option.optionName);
                        if (index !== -1) {
                            selectedFilters.splice(index, 1);
                        }
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

        const nonSortingFilters = selectedFilters.filter((filter) =>
            !['Name (A-Z)', 'Name (Z-A)', 'Price (ASC)', 'Price (DESC)'].includes(filter)
        );

        if (nonSortingFilters.length !== 0) {
            nonSortingFilters.forEach((filter) => {
                displayedGames = gameList.filter((game) => {
                    return filter === game.publisher || filter === game.category;
                });
            });
        } else {
            displayedGames = gameList;
        }


        const sortFilter = selectedFilters.filter(filter =>
            ['Name (A-Z)', 'Name (Z-A)', 'Price (ASC)', 'Price (DESC)'].includes(filter)
        );

        sortFilter.forEach(filter => {
            displayedGames = sortBy(displayedGames, filter);
        });

        const newGamesContainer = loadGamesContainer(displayedGames);
        homeContainer.appendChild(newGamesContainer);
    });

    filterContainer.appendChild(confirmButton);
    homeContainer.appendChild(filterContainer);

    const gamesContainer = loadGamesContainer(gameList);
    homeContainer.appendChild(gamesContainer);

    document.body.appendChild(homeContainer);

};

function searchGamesByKeyWord(gameList) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    // Filter the games based on the search input
    const filteredGames = gameList.filter(game =>
        game.product_name.toLowerCase().includes(searchInput) ||
        game.publisher.toLowerCase().includes(searchInput) ||
        game.category.toLowerCase().includes(searchInput)
    );

    let container = document.getElementsByClassName('games');
    if (container.length > 0) {
        container[0].innerHTML = '';
        loadGamesContainer(filteredGames);
    }
    console.log(filteredGames);
}


// CHECKOUT PAGE

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
            const billingAddress = document.getElementById('billingAddress');
            billingAddress.value = `${userInfo.user.billingAddress}`;
            const city = document.getElementById('city');
            city.value = `${userInfo.user.city}`;
            const state = document.getElementById('state');
            state.value = `${userInfo.user.state}`;
            const country = document.getElementById('country');
            country.value = `${userInfo.user.country}`;
            const postalCode = document.getElementById('postalCode');
            postalCode.value = `${userInfo.user.postalCode}`;

            const nameOnCard = document.getElementById('name');
            nameOnCard.value = `${userInfo.user.nameOnCard}`;
            const cardNumber = document.getElementById('cardNumber');
            cardNumber.value = `${userInfo.user.cardNumber}`;
            const cvv = document.getElementById('cvv');
            cvv.value = `${userInfo.user.cvv}`;
            const expiryDate = document.getElementById('expiryDate');
            expiryDate.value = `${userInfo.user.expiryDate}`;
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
            if (userInfo.user.billingAddress !== formData.billingAddress ||
                userInfo.user.city !== formData.city ||
                userInfo.user.state !== (formData.state) ||
                userInfo.user.country !== (formData.country) ||
                userInfo.user.postalCode !== (formData.postalCode) ||
                userInfo.user.nameOnCard !== (formData.name) ||
                userInfo.user.cvv !== (formData.cvv) ||
                userInfo.user.expiryDate !== (formData.expiryDate) ||
                userInfo.user.cardNumber !== (formData.cardNumber)) {
                const newUserData = JSON.stringify({
                    userId: userInfo.user.id,
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
                    newUserInfo = '\n\nYour new payment information was saved.'
                }
            }
            const orderPlacement = await placeOrder(combinedData);
            if (orderPlacement.ok) {
                // Clear the cart locally
                cart = [];
                // Refresh the cart from the server
                await loadCart();
                window.alert('Order placed, thank you! You will be redirected to your profile now. You will see your order there.' + newUserInfo)
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
    const gameList = await getGameList();

    if (window.location.pathname === '/checkoutPage.html') {
        updateCheckoutPage();
    } else {
        updateShoppingPage();
    }
    populateFeaturedGames(gameList);

});
function populateFeaturedGames(gameList) {
    const featuredGamesContainer = document.querySelector('.game-carousel');

    // Clear existing content to prevent duplication
    featuredGamesContainer.innerHTML = '';

    // display the first three games as featured games
    const featuredGames = gameList.slice(0, 3);

    featuredGames.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';

        const img = document.createElement('img');
        img.src = game.image_url;
        img.alt = game.product_name;

        const title = document.createElement('p');
        title.textContent = game.product_name;

        gameItem.appendChild(img);
        gameItem.appendChild(title);

        featuredGamesContainer.appendChild(gameItem);
    });
}
async function updateUserStatus() {
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