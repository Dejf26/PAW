import { Project } from './interfaces/projectInterface';
import { ApiService } from './apiService';
import { ProjectService } from './projectService';
import { createNavbar, setUserDisplayName } from './navbar';

createNavbar();
setUserDisplayName();

// const user = User.getInstance();
// const userNameElement = document.getElementById('user-name');
// if (userNameElement) {
//   userNameElement.textContent = user.getUser().firstName;
// }

ApiService.registerService('projects', new ProjectService());

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
    <button class="btn-update" data-id="${project.id}">Edit</button>
    <button class="btn-delete" data-id="${project.id}">Delete</button>
    <button class="btn-select" data-id="${project.id}">${activeProjectId === String(project.id) ? 'Selected' : 'Select'}</button>
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

    ApiService.add<Project>('projects', newProject);

    nameInput.value = '';
    descriptionInput.value = '';

    const updatedProjects = ApiService.getAll<Project>('projects');
    displayProjects(updatedProjects);
  }
}

function openUpdateModal(projectId: number): void {
  const updateModal = document.getElementById('update-modal');
  const projectToUpdate = ApiService.getOne<Project>('projects', projectId);

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

    ApiService.update<Project>('projects', updatedProject);

    const updatedProjects = ApiService.getAll<Project>('projects');
    displayProjects(updatedProjects);

    const updateModal = document.getElementById('update-modal');
    if (updateModal) {
      updateModal.style.display = 'none';
    }
  }
}

function deleteProject(projectId: number): void {
  const confirmDelete = confirm('Are you sure you want to delete this project?');

  if (confirmDelete) {
    ApiService.delete('projects', projectId);

    const updatedProjects = ApiService.getAll<Project>('projects');
    displayProjects(updatedProjects);

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
    button.textContent = 'Select';
    button.disabled = false;
  });
  const selectedButton = document.querySelector(`.btn-select[data-id="${projectId}"]`) as HTMLButtonElement;
  if (selectedButton) {
    selectedButton.textContent = 'Selected';
    selectedButton.disabled = true;
  }
  window.location.href = './active-project.html';
}

const projects = ApiService.getAll<Project>('projects');

displayProjects(projects);

const addProjectFormElement = document.getElementById('add-project-form');
if (addProjectFormElement) {
  addProjectFormElement.addEventListener('submit', addProjectForm);
}

const toggleFormButton = document.getElementById('toggle-form-button');

if (toggleFormButton) {
  toggleFormButton.addEventListener('click', () => {
    const addProjectForm = document.getElementById('add-project-form');
    if (addProjectForm) {
      addProjectForm.classList.toggle('hidden-fields');
    }
  });
}
