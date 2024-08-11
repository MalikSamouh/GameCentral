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
let cart = [];

async function loadCart() {
  try {
    const response = await fetch('/api/cart');
    const data = await response.json();
    cart = data.cart;
    updateCartDisplay();
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

function updateCheckoutPage() {
    const cartSummary = document.getElementById('cartSummary');
    if (cartSummary) {
        cartSummary.innerHTML = ''; // Clear previous contents
        let total = 0;

        // Check if the cart has any items
        if (cart.length === 0) {
            cartSummary.textContent = "Your cart is empty.";
        } else {
            // Loop through each cart item and add it to the summary
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.textContent = `${item.product.product_name} - $${item.product.price} x ${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`;
                cartSummary.appendChild(itemElement);
                total += item.product.price * item.quantity;
            });

            const totalElement = document.createElement('div');
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
            cartSummary.appendChild(totalElement);
        }
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    updateUserStatus();
    updateUserStatus();
    await loadCart(); 

    if (window.location.pathname === '/checkoutPage.html') {
        updateCheckoutPage(); 
    }


    const cartModal = document.getElementById("cartModal");
    const cartButton = document.getElementById("cartButton");
    const cartSpan = document.getElementsByClassName("close")[0];
    
    const userLoggerIn = await isUserLoggedIn();
    
    cartButton.onclick = () => {
        if (userLoggerIn) {
            console.log('clicked');
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

document.addEventListener('DOMContentLoaded', loadCart);
document.addEventListener('DOMContentLoaded', updateUserStatus);


