import { ProjectApi } from './projectApi';
import { Project } from './interfaces/projectInterface';
import { User } from "./user";

const user = User.getInstance();
const userNameElement = document.getElementById('user-name');
if (userNameElement) {
  userNameElement.textContent = user.getUser().firstName;
}

const activeProjectId = localStorage.getItem('activeProjectId');



function displayProjects(projects: Project[]): void {
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer) {
    projectsContainer.innerHTML = '';

    projects.forEach((project) => {
      const projectElement = createProjectElement(project);
      projectsContainer.appendChild(projectElement);
    });
  }
}

function createProjectElement(project: Project): HTMLElement {
  const projectElement = document.createElement('div');
  projectElement.classList.add('project-card');
  projectElement.innerHTML = `
    <strong>${project.name}</strong>: ${project.description}
    <button class="btn-update" data-id="${project.id}">Edytuj</button>
    <button class="btn-delete" data-id="${project.id}">Usuń</button>
    <button class="btn-select" data-id="${project.id}">${activeProjectId === String(project.id) ? 'Wybrano' : 'Wybierz'}</button>
  `;

  const updateButton = projectElement.querySelector('.btn-update');
  const deleteButton = projectElement.querySelector('.btn-delete');
  const selectButton = projectElement.querySelector('.btn-select');

  if (updateButton) {
    updateButton.addEventListener('click', () => openUpdateModal(project.id));
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', () => deleteProject(project.id));
  }

  if (selectButton) {
    selectButton.addEventListener('click', () => selectProject(project.id));
  }

  return projectElement;
}

function addProjectForm(event: Event): void {
  event.preventDefault();

  const nameInput = document.getElementById('project-name') as HTMLInputElement;
  const descriptionInput = document.getElementById('project-description') as HTMLInputElement;

  if (nameInput && descriptionInput) {
    const newProject: Project = {
      id: Date.now(),
      name: nameInput.value,
      description: descriptionInput.value,
    };

    ProjectApi.addProject(newProject);

    nameInput.value = '';
    descriptionInput.value = '';

    const updatedProjects = ProjectApi.getProjects();
    displayProjects(updatedProjects);
  }
}

function openUpdateModal(projectId: number): void {
  const updateModal = document.getElementById('update-modal');
  const projectToUpdate = ProjectApi.getProjects().find((p) => p.id === projectId);

  if (updateModal && projectToUpdate) {
    const projectNameInput = document.getElementById('update-project-name') as HTMLInputElement;
    const projectDescriptionInput = document.getElementById('update-project-description') as HTMLInputElement;

    if (projectNameInput && projectDescriptionInput) {
      projectNameInput.value = projectToUpdate.name;
      projectDescriptionInput.value = projectToUpdate.description;

      const saveChangesButton = document.getElementById('save-changes-button');
      const cancelButton = document.getElementById('cancel-button');

      if (saveChangesButton && cancelButton) {
        saveChangesButton.onclick = () => saveChanges(projectToUpdate.id);
        cancelButton.onclick = () => updateModal.style.display = 'none';
      }

      updateModal.style.display = 'block';
    }
  }
}

function saveChanges(projectId: number): void {
  const projectNameInput = document.getElementById('update-project-name') as HTMLInputElement;
  const projectDescriptionInput = document.getElementById('update-project-description') as HTMLInputElement;

  if (projectNameInput && projectDescriptionInput) {
    const updatedProject: Project = {
      id: projectId,
      name: projectNameInput.value,
      description: projectDescriptionInput.value,
    };

    ProjectApi.updateProject(updatedProject);

    const updatedProjects = ProjectApi.getProjects();
    displayProjects(updatedProjects);

    const updateModal = document.getElementById('update-modal');
    if (updateModal) {
      updateModal.style.display = 'none';
    }
  }
}

function deleteProject(projectId: number): void {
  const confirmDelete = confirm('Czy na pewno chcesz usunąć ten projekt?');

  if (confirmDelete) {
    ProjectApi.deleteProject(projectId);

    const updatedProjects = ProjectApi.getProjects();
    displayProjects(updatedProjects);

    // Usuwamy aktywny projekt z localStorage, jeśli jego ID jest równie zapisane
    const activeProjectId = localStorage.getItem('activeProjectId');
    if (activeProjectId && parseInt(activeProjectId) === projectId) {
      localStorage.removeItem('activeProjectId');
    }
  }
}


function selectProject(projectId: number): void {
  localStorage.setItem('activeProjectId', String(projectId));
   const selectButtons = document.querySelectorAll('.btn-select') as NodeListOf<HTMLButtonElement>;
  selectButtons.forEach(button => {
    button.textContent = 'Wybierz';
    button.disabled = false;
  });
  const selectedButton = document.querySelector(`.btn-select[data-id="${projectId}"]`) as HTMLButtonElement;
  if (selectedButton) {
    selectedButton.textContent = 'Wybrano';
    selectedButton.disabled = true;
  }
  window.location.href = './active-project.html';
}

const projects = ProjectApi.getProjects();

displayProjects(projects);

const addProjectFormElement = document.getElementById('add-project-form');
if (addProjectFormElement) {
  addProjectFormElement.addEventListener('submit', addProjectForm);
}

