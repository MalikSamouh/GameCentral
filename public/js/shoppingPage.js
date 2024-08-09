const getGameList = async () => {
    try {
        const response = await fetch('api/product');
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

const filterList = [
    {
        filterName: 'Type',
        filterOptions: [
            {
                optionName: 'Game'
            },
            {
                optionName: 'DLC'
            },
            {
                optionName: 'Soundtrack'
            },
        ]
    },
    {
        filterName: 'Publisher',
        filterOptions: [
            {
                optionName: 'Test Publisher 1'
            },
            {
                optionName: 'Test Publisher 2'
            },
            {
                optionName: 'Test Publisher 3'
            },
        ]
    },
    {
        filterName: 'Category',
        filterOptions: [
            {
                optionName: 'Action'
            },
            {
                optionName: 'Sports'
            },
            {
                optionName: 'RPG'
            },
            {
                optionName: 'Strategy'
            },
        ]
    }
]

//initialize the cart array
let cart = [];

function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.product_name === productId);

    if (cartItemIndex > -1) {
        cart[cartItemIndex].quantity -= 1;
        if (cart[cartItemIndex].quantity === 0) {
            cart.splice(cartItemIndex, 1);
        }
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.product_name} - $${item.price} x ${item.quantity} = ${item.price * item.quantity} `;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.product_name);
        itemElement.appendChild(removeButton);
        cartContainer.appendChild(itemElement);
        totalPrice += item.price * item.quantity;
    });
    const total = document.getElementById('price');
    if (total) {
        total.innerHTML = '';
    }
    const totalPriceDiv = document.createElement('div');
    totalPriceDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    cartContainer.appendChild(totalPriceDiv);
    const cartImage = document.getElementById('shoppingCartIcon');
    if (cart.length > 0) {
        cartImage.src = '/images/shoppingCartFull.png';
    } else {
        cartImage.src = '/images/shoppingCartEmpty.png';
    }
}

function addToCart(productId, gameList) {
    const product = gameList.find(p => p.product_name === productId);
    const cartItem = cart.find(item => item.product_name === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    updateCartDisplay();
}

const loadGamesContainer = (displayedGames) => {
    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games';
    displayedGames.forEach(game => {
        const gamesDiv = document.createElement('div');
        const gamesImage = document.createElement('img');
        gamesImage.src = game.image_url;
        gamesImage.className = 'gamePic';
        gamesDiv.appendChild(gamesImage);

        const gamesDesc = document.createElement('div');
        gamesDesc.className = 'gameDesc';
        const gameName = document.createElement('div');
        gameName.className = 'gameName';
        gameName.textContent = game.product_name;
        gamesDesc.appendChild(gameName);

        const gamePublisher = document.createElement('div');
        gamePublisher.textContent = game.description;
        gamesDesc.appendChild(gamePublisher);

        const gamePrice = document.createElement('div');
        gamePrice.textContent = '$' + game.price;
        gamePrice.className = 'gamePrice';
        gamesDesc.appendChild(gamePrice);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.onclick = () => addToCart(game.product_name, displayedGames);
        gamesDesc.appendChild(addButton);

        gamesDiv.appendChild(gamesDesc);
        gamesContainer.appendChild(gamesDiv);
    });
    return gamesContainer;
};

document.addEventListener('DOMContentLoaded', async () => {

    const cartModal = document.getElementById("cartModal");
    const cartButton = document.getElementById("cartButton");
    const cartSpan = document.getElementsByClassName("close")[0];
    cartButton.onclick = () => {
        cartModal.style.display = "block";
    }
    cartSpan.onclick = () => {
        cartModal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
        }
    }

    const gameList = await getGameList();
    const homeContainer = document.createElement('div');
    homeContainer.className = 'homeContainer';
    const title = document.createElement('div');
    title.textContent = 'Game Catalogue';
    title.className = 'homepageTitle';
    document.body.appendChild(title);
    let displayedGames = gameList;

    // filters
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filters';
    const selectedFilters = [];
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
        // plus button that opens the dropdown list
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
        // confirm filters button
        filterContainer.appendChild(filterDiv);
        filterContainer.appendChild(filterOptions);
    });
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Apply Filters';
    confirmButton.className = 'confirmButton'
    confirmButton.addEventListener("click", () => {
        displayedGames = gameList.filter((game) => {
            if (selectedFilters.length !== 0) {
                return selectedFilters.some((filter) => filter == game.publisher
                    || filter == game.genre || filter == game.category)
            }
            return gameList;
        });
        let container = document.getElementsByClassName('games');
        container[0].innerHTML = '';
        const newValue = loadGamesContainer(displayedGames);
        container[0].innerHTML = newValue.innerHTML;
    });
    filterContainer.appendChild(confirmButton);
    homeContainer.appendChild(filterContainer);

    // games
    const gamesContainer = loadGamesContainer(gameList);
    homeContainer.appendChild(gamesContainer);

    document.body.appendChild(homeContainer);
});