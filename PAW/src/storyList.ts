import { Story } from "./interfaces/storyInterface";
import { apiService } from "./apiService";
import { User } from "./user";

const user = User.getInstance();
const userNameElement = document.getElementById('user-name');
if (userNameElement) {
  userNameElement.textContent = user.getUser().firstName;
}

function displayStoryDetailsModal(story: Story): void {
    const modal = document.getElementById('story-details-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = '';

            const nameParagraph = document.createElement('p');
            nameParagraph.textContent = `Name: ${story.name}`;

            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.textContent = `Description: ${story.description}`;

            const priorityParagraph = document.createElement('p');
            priorityParagraph.textContent = `Priority: ${story.priority}`;

            const projectParagraph = document.createElement('p');
            projectParagraph.textContent = `Project: ${story.project}`;

            const createdAtParagraph = document.createElement('p');
            createdAtParagraph.textContent = `Create date: ${story.createdAt}`;

            const statusParagraph = document.createElement('p');
            statusParagraph.textContent = `Status: ${story.status}`;

            const ownerIdParagraph = document.createElement('p');
            ownerIdParagraph.textContent = `Owner: ${story.ownerId}`;

            modalContent.appendChild(nameParagraph);
            modalContent.appendChild(descriptionParagraph);
            modalContent.appendChild(priorityParagraph);
            modalContent.appendChild(projectParagraph);
            modalContent.appendChild(createdAtParagraph);
            modalContent.appendChild(statusParagraph);
            modalContent.appendChild(ownerIdParagraph);

            const closeButton = document.getElementById('close-details-modal');
            if (closeButton) {
                closeButton.onclick = () => {
                    if (modal) {
                        modal.style.display = 'none';
                    }
                };
            }

            modal.style.display = 'block';
        }
    } else {
        console.error('Not found');
    }
}

window.onclick = (event) => {
    const modal = document.getElementById('story-details-modal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
};


function createStoryElement(story: Story): HTMLElement {
    const storyElement = document.createElement('div');
    storyElement.classList.add('story-card');
    storyElement.innerHTML = `
      <strong>${story.name}</strong>
      <button class="btn-edit" data-id="${story.id}">Edit</button>
      <button class="btn-delete" data-id="${story.id}">Delete</button>
      <button class="btn-details" data-id="${story.id}">Details</button>
    `;
  
    const editButton = storyElement.querySelector('.btn-edit');
    const deleteButton = storyElement.querySelector('.btn-delete');
    const detailsButton = storyElement.querySelector('.btn-details');
  
    if (editButton) {
      editButton.addEventListener('click', () => openEditModal(story));
    }
  
    if (deleteButton) {
      deleteButton.addEventListener('click', () => deleteStory(story.id));
    }
  
    if (detailsButton) {
      detailsButton.addEventListener('click', () => displayStoryDetailsModal(story));
    }
  
    return storyElement;
  }
  

function displayStories(status: 'todo' | 'doing' | 'done'): void {
    const stories = apiService.getStories().filter(story => story.status === status);

    const storyList = document.getElementById('story-list');
    if (storyList) {
        storyList.innerHTML = '';

        const categoryHeading = document.createElement('h2');
        categoryHeading.textContent = capitalize(status);
        storyList.appendChild(categoryHeading);

        stories.forEach(story => {
            const li = createStoryElement(story);
            storyList.appendChild(li);
        });
    } else {
        console.error('Not found');
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function openEditModal(story: Story): void {
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        const editStoryNameInput = document.getElementById('edit-story-name') as HTMLInputElement;
        const editStoryDescriptionInput = document.getElementById('edit-story-description') as HTMLInputElement;
        const editStoryPriorityInput = document.getElementById('edit-story-priority') as HTMLSelectElement;
        const editStoryStatusInput = document.getElementById('edit-story-status') as HTMLSelectElement;

        if (editStoryNameInput && editStoryDescriptionInput && editStoryPriorityInput && editStoryStatusInput) {
            editStoryNameInput.value = story.name;
            editStoryDescriptionInput.value = story.description;
            editStoryPriorityInput.value = story.priority;
            editStoryStatusInput.value = story.status;

            const saveChangesButton = document.getElementById('save-changes-button');
            if (saveChangesButton) {
                saveChangesButton.onclick = () => saveChanges(story.id);
            }

            const cancelButton = document.getElementById('cancel-button');
            if (cancelButton) {
                cancelButton.onclick = () => editModal.style.display = 'none';
            }

            editModal.style.display = 'block';
        }
    }
}


function saveChanges(storyId: number): void {
    const editStoryNameInput = document.getElementById('edit-story-name') as HTMLInputElement;
    const editStoryDescriptionInput = document.getElementById('edit-story-description') as HTMLInputElement;
    const editStoryPriorityInput = document.getElementById('edit-story-priority') as HTMLSelectElement;
    const editStoryStatusInput = document.getElementById('edit-story-status') as HTMLSelectElement;

    const newName = editStoryNameInput.value;
    const newDescription = editStoryDescriptionInput.value;
    const newPriority = editStoryPriorityInput.value as 'low' | 'medium' | 'high';
    const newStatus = editStoryStatusInput.value as 'todo' | 'doing' | 'done';

    const updatedStory: Story = {
        id: storyId,
        name: newName,
        description: newDescription,
        priority: newPriority,
        project: 0,
        createdAt: new Date(),
        status: newStatus,
        ownerId: 0
    };

    apiService.updateStory(updatedStory);

    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.style.display = 'none';
    }

    displayStories(newStatus);
}




function deleteStory(storyId: number): void {
    apiService.deleteStory(storyId);

    displayStories('todo'); 
}

function addStory(event: Event): void {
    event.preventDefault();

    const nameInput = document.getElementById('story-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('story-description') as HTMLInputElement;
    const prioritySelect = document.getElementById('story-priority') as HTMLSelectElement;
    const projectInput = document.getElementById('story-project') as HTMLInputElement;
    const ownerIdInput = document.getElementById('story-owner') as HTMLInputElement;

    const name = nameInput.value;
    const description = descriptionInput.value;
    const priority = prioritySelect.value as 'low' | 'medium' | 'high';
    const project = parseInt(projectInput.value);
    const ownerId = parseInt(ownerIdInput.value);
    const newStory: Story = {
        id: Date.now(), 
        name,
        description,
        priority,
        project,
        createdAt: new Date(),
        status: 'todo',
        ownerId
    };

    apiService.addStory(newStory);

    displayStories('todo');

    nameInput.value = '';
    descriptionInput.value = '';
    prioritySelect.value = 'low';
    projectInput.value = '';
    ownerIdInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const btnTodo = document.getElementById('btnTodo');
    const btnDoing = document.getElementById('btnDoing');
    const btnDone = document.getElementById('btnDone');

    if (btnTodo) {
        btnTodo.addEventListener('click', () => displayStories('todo'));
    }

    if (btnDoing) {
        btnDoing.addEventListener('click', () => displayStories('doing'));
    }

    if (btnDone) {
        btnDone.addEventListener('click', () => displayStories('done'));
    }

    const addStoryForm = document.getElementById('add-story-form');
    if (addStoryForm) {
        addStoryForm.addEventListener('submit', addStory);
    }

    displayStories('todo');
});

const toggleStoryFormButton = document.getElementById('toggle-story-form-button');

if (toggleStoryFormButton) {
  toggleStoryFormButton.addEventListener('click', () => {
    const addStoryForm = document.getElementById('add-story-form');
    if (addStoryForm) {
      addStoryForm.classList.toggle('hidden-fields');
    }
  });
}
