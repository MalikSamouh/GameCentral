// test variable for gameList
const gameList = [
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

// function for data rendering
document.addEventListener('DOMContentLoaded', () => {
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
