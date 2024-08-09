<<<<<<< Updated upstream
// test variable for gameList
const gameList = [
=======
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
>>>>>>> Stashed changes
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
    {
        gameName: 'testName1',
        publisher: 'testPublisher1',
        price: '19.99',
        pic: '../public/images/FlagofCanada.png',
    },
];

// test variable for filter list
const filterList = [
    {
        filterName: 'filterOne',
    },
    {
        filterName: 'filterOne',
    },
    {
        filterName: 'filterOne',
    },
    {
        filterName: 'filterOne',
    },
]

<<<<<<< Updated upstream
// function for data rendering
document.addEventListener('DOMContentLoaded', () => {
=======
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
    
>>>>>>> Stashed changes
    const homeContainer = document.createElement('div');
    homeContainer.className = 'homeContainer';
    const title = document.createElement('div');
    title.textContent = 'Game Catalogue';
    title.className = 'homepageTitle';
    document.body.appendChild(title);

    // filters
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filters';
    filterList.forEach(filter => {
        const filterDiv = document.createElement('div');
        filterDiv.textContent = filter.filterName;
        filterContainer.appendChild(filterDiv);
    });
    homeContainer.appendChild(filterContainer);

    // games
    const gamesContainer = document.createElement('div');
    gamesContainer.className = 'games';
    gameList.forEach(game => {
        const gamesDiv = document.createElement('div');
        const gamesImage = document.createElement('img');
        gamesImage.src = game.pic;
        gamesImage.className = 'gamePic';
        gamesDiv.appendChild(gamesImage);

        const gamesDesc = document.createElement('div');
        gamesDesc.className = 'gameDesc'
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

        gamesDiv.appendChild(gamesDesc);
        gamesContainer.appendChild(gamesDiv);
    });
    homeContainer.appendChild(gamesContainer);

    document.body.appendChild(homeContainer);
});
