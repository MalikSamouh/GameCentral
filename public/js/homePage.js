import { getGameList, updateUserStatus } from "./apiRequests.js";

function populateFeaturedGames(gameList) {
    const featuredGamesContainer = document.querySelector('.game-carousel');
    featuredGamesContainer.innerHTML = '';
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

document.addEventListener('DOMContentLoaded', async () => {
    await updateUserStatus();
    const gameList = await getGameList();
    populateFeaturedGames(gameList);
});