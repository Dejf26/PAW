import { Project } from "../interfaces/projectInterface";
import { ProjectService } from "../services/projectService"; // Zmiana importu
import { createNavbar, setUserDisplayName } from "./navbar";

createNavbar();
setUserDisplayName();

const projectService = new ProjectService(); // Utwórz instancję ProjectService

document.addEventListener('DOMContentLoaded', () => {
    const activeProjectId = localStorage.getItem('activeProjectId');
    if (activeProjectId) {
        const project = projectService.getOne(Number(activeProjectId)); // Użyj ProjectService
        if (project) {
            displayProjectDetails(project);
        } else {
            console.error('The project with the given ID could not be found');
        }
    } else {
        console.error('No active project');
    }
});

function displayProjectDetails(project: Project): void {
    const projectDetailsContainer = document.querySelector('.project-details') as HTMLElement;
    if (projectDetailsContainer) {
        projectDetailsContainer.innerHTML = `
        <p><strong>ID</strong>: ${project.id}</p>
        <p><strong>Name</strong>: ${project.name}</p>
        <p><strong>Description</strong>: ${project.description}</p>
        `;
    }
}
