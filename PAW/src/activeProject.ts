import { User } from "./user";
import { Project } from "./interfaces/projectInterface";
import { ApiService } from './apiService';
import { ProjectService } from "./projectService"; // Zmiana importu

const user = User.getInstance();
const userNameElement = document.getElementById('user-name');
if (userNameElement) {
  userNameElement.textContent = user.getUser().firstName;
}

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
