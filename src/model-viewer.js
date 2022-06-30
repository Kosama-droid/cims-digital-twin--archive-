import { projects } from "./cdc-models.js";

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentProjectID = url.searchParams.get("id");

// Get the current project
const currentProject = projects.find(project => project.id == currentProjectID);

// Add the project URL to the iframe
const iframe = document.getElementById("model-iframe");
iframe.src = currentProject.url;