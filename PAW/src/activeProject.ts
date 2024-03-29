import { User } from "./user";
import { Project } from "./interfaces/projectInterface";
import { ProjectApi } from "./projectApi";

const user = User.getInstance();
const userNameElement = document.getElementById('user-name');
if (userNameElement) {
  userNameElement.textContent = user.getUser().firstName;
}

document.addEventListener('DOMContentLoaded', () => {
    const activeProjectId = localStorage.getItem('activeProjectId');
    if (activeProjectId) {
        const project = ProjectApi.getProjectById(Number(activeProjectId)); // Pobieranie szczegółów aktywnego projektu
        if (project) {
            displayProjectDetails(project);
        } else {
            console.error('Nie można znaleźć projektu o podanym ID');
        }
    } else {
        console.error('Brak aktywnego projektu');
    }
});

function displayProjectDetails(project: Project): void {
    const projectDetailsContainer = document.querySelector('.project-details') as HTMLElement;
    if (projectDetailsContainer) {
        projectDetailsContainer.innerHTML = `
        <p><strong>ID</strong>: ${project.id}</p>
        <p><strong>Nazwa</strong>: ${project.name}</p>
        <p><strong>Opis</strong>: ${project.description}</p>
        `;
    }
}
