import { models } from "../static/data/cdc-models.js";;

// Get all cards
const modelsContainer = document.getElementById("model-container");
const modelCards = Array.from(modelsContainer.children);

const templateModelCard = modelCards[0];

const baseURL = './model-viewer.html';

for(let model of models) {
    // Create a new card
    const newCard = templateModelCard.cloneNode(true);

    // Add model name to card
    const cardTitle = newCard.querySelector('h2');
    cardTitle.textContent = model.name;

    // Add model URL to card
    const card = newCard.querySelector('a');
    card.href = baseURL + `?id=${model.code}`;

    // Add card to container
    modelsContainer.appendChild(newCard)
}

templateModelCard.remove()
