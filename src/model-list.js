import { projects } from "./cdc-models.js";;

// Get all cards
const projectsContainer = document.getElementById("projects-container");
const projectCards = Array.from(projectsContainer.children);

const templateProjetCard = projectCards[0];

const baseURL = './model-viewer.html';

for(let project of projects) {
    // Create a new card
    const newCard = templateProjetCard.cloneNode(true);

    // Add project name to card
    const cardTitle = newCard.querySelector('h2');
    cardTitle.textContent = project.name;

    // Add project URL to card
    const card = newCard.querySelector('a');
    card.href = baseURL + `?id=${project.code}`;

    // Add card to container
    projectsContainer.appendChild(newCard)
}

templateProjetCard.remove()
