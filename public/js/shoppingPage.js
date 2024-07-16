// test variable for gameList
const gameList = [
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 1',
        category: 'Game',
        genre: 'Test Genre 1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 1',
        genre: 'Test Genre 1',
        category: 'DLC',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 2',
        category: 'Game',
        genre: 'Test Genre 3',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 1',
        category: 'DLC',
        genre: 'Test Genre 3',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 3',
        category: 'DLC',
        genre: 'Test Genre 3',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 2',
        category: 'Game',
        genre: 'Test Genre 2',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'Test Publisher 3',
        category: 'Soundtrack',
        genre: 'Test Genre 1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
];

// test variable for filter list
const filterList = [
    {
        filterName: 'Category',
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
        filterName: 'Genre',
        filterOptions: [
            {
                optionName: 'Test Genre 1'
            },
            {
                optionName: 'Test Genre 2'
            },
            {
                optionName: 'Test Genre 3'
            },
        ]
    }
];

const loadGamesContainer = (displayedGames) => {
    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games';
    displayedGames.forEach(game => {
        const gamesDiv = document.createElement('div');
        const gamesImage = document.createElement('img');
        gamesImage.src = game.pic;
        gamesImage.className = 'gamePic';
        gamesDiv.appendChild(gamesImage);

        const gamesDesc = document.createElement('div');
        gamesDesc.className = 'gameDesc';
        const gameName = document.createElement('div');
        gameName.className = 'gameName';
        gameName.textContent = game.gameName;
        gamesDesc.appendChild(gameName);

        const gamePublisher = document.createElement('div');
        gamePublisher.textContent = game.publisher;
        gamesDesc.appendChild(gamePublisher);

        const gamePrice = document.createElement('div');
        gamePrice.textContent = '$' + game.price;
        gamePrice.className = 'gamePrice';
        gamesDesc.appendChild(gamePrice);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.onclick = () => addToCart(game.gameName);
        gamesDesc.appendChild(addButton);

        gamesDiv.appendChild(gamesDesc);
        gamesContainer.appendChild(gamesDiv);
    });
    return gamesContainer;
};

// function for data rendering
document.addEventListener('DOMContentLoaded', () => {
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

    //initialize the cart array
let cart = [];

function addToCart(productId) {
    const product = gameList.find(p => p.gameName === productId);
    const cartItem = cart.find(item => item.gameName === productId);

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

function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.gameName === productId);

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

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.gameName} - $${item.price} x ${item.quantity}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.gameName);
        itemElement.appendChild(removeButton);
        cartContainer.appendChild(itemElement);
    });
}

});
