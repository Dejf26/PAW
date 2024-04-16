import { Story } from "../interfaces/storyInterface";
import { ApiService } from '../services/apiService';
import { StoryService } from '../services/storyService';
import { createNavbar, setUserDisplayName } from "./navbar";
import { User } from "../interfaces/userInterface"
import { User as UserService } from "./user";




createNavbar();
setUserDisplayName();


function createUserOption(user: User): HTMLOptionElement {
    const option = document.createElement('option');
    option.value = user.id.toString();
    option.textContent = `${user.firstName} ${user.lastName}`;
    return option;
}

function displayUserSelectOptions(): void {
    const userSelect = document.getElementById('story-owner') as HTMLSelectElement;
    if (userSelect) {
        const userList = UserService.getInstance().getUsers();
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        userSelect.appendChild(emptyOption);
        
        userList.forEach(user => {
            const option = createUserOption(user);
            userSelect.appendChild(option);
        });
    }
}


// Wywołanie funkcji do wyświetlenia listy wyboru użytkowników po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    displayUserSelectOptions();
});

ApiService.registerService('stories', new StoryService());

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

            const closeButton = document.getElementById('close-modal-btn');
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

const todoList = document.getElementById('todo-list');
const doingList = document.getElementById('doing-list');
const doneList = document.getElementById('done-list');

function displayStoriesInKanban(stories: Story[]) {
    if (todoList && doingList && doneList) {
        todoList.innerHTML = '';
        doingList.innerHTML = '';
        doneList.innerHTML = '';

        stories.forEach((story: Story) => {
            const storyElement = createStoryElement(story);
            if (story.status === 'todo') {
                todoList.appendChild(storyElement);
            } else if (story.status === 'doing') {
                doingList.appendChild(storyElement);
            } else if (story.status === 'done') {
                doneList.appendChild(storyElement);
            }
        });
    } else {
        console.error('One or more stories lists are missing');
    }
}

async function displayKanbanBoard() {
    const stories = await ApiService.getAll<Story>('stories');
    displayStoriesInKanban(stories);
}

document.addEventListener('DOMContentLoaded', () => {
    displayKanbanBoard();
});


function openEditModal(story: Story): void {
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        const editStoryNameInput = document.getElementById('edit-story-name') as HTMLInputElement;
        const editStoryDescriptionInput = document.getElementById('edit-story-description') as HTMLInputElement;
        const editStoryPriorityInput = document.getElementById('edit-story-priority') as HTMLSelectElement;
        const editStoryStatusInput = document.getElementById('edit-story-status') as HTMLSelectElement;
        const editStoryOwnerInput = document.getElementById('edit-story-owner') as HTMLSelectElement;

        if (editStoryNameInput && editStoryDescriptionInput && editStoryPriorityInput && editStoryStatusInput && editStoryOwnerInput) {
            editStoryNameInput.value = story.name;
            editStoryDescriptionInput.value = story.description;
            editStoryPriorityInput.value = story.priority;
            editStoryStatusInput.value = story.status;

            editStoryOwnerInput.innerHTML = '';

            const userList = UserService.getInstance().getUsers();
            userList.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id.toString();
                option.textContent = `${user.firstName} ${user.lastName} (${user.role})`;

                editStoryOwnerInput.appendChild(option);
            });

            editStoryOwnerInput.value = '';

            if (story.ownerId) {
                editStoryOwnerInput.value = story.ownerId.toString();
            }

            const saveChangesButton = document.getElementById('save-changes-button');
            if (saveChangesButton) {
                saveChangesButton.onclick = () => saveChanges(story.id);
            }

            const cancelButton = document.getElementById('cancel-button');
            if (cancelButton) {
                cancelButton.onclick = () => editModal.style.display = 'none';
            }
            editStoryOwnerInput.required = story.ownerId !== undefined;

            editModal.style.display = 'block';
        }
    }
}


function saveChanges(storyId: number): void {
    const editStoryNameInput = document.getElementById('edit-story-name') as HTMLInputElement;
    const editStoryDescriptionInput = document.getElementById('edit-story-description') as HTMLInputElement;
    const editStoryPriorityInput = document.getElementById('edit-story-priority') as HTMLSelectElement;
    const editStoryStatusInput = document.getElementById('edit-story-status') as HTMLSelectElement;
    const editStoryOwnerInput = document.getElementById('edit-story-owner') as HTMLSelectElement;

    const newName = editStoryNameInput.value;
    const newDescription = editStoryDescriptionInput.value;
    const newPriority = editStoryPriorityInput.value as 'low' | 'medium' | 'high';
    const newStatus = editStoryStatusInput.value as 'todo' | 'doing' | 'done';
    const newOwnerId = editStoryOwnerInput.value ? parseInt(editStoryOwnerInput.value) : undefined; // Sprawdzamy, czy właściciel został wybrany

    const updatedStory: Story = {
        id: storyId,
        name: newName,
        description: newDescription,
        priority: newPriority,
        project: 0,
        createdAt: new Date(),
        status: newStatus,
        ownerId: newOwnerId !== undefined ? newOwnerId : 0 // Przypisanie wartości tylko wtedy, gdy wybierzemy właściciela
    };

    ApiService.update('stories', updatedStory);

    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.style.display = 'none';
    }

    displayKanbanBoard();
}

function deleteStory(storyId: number): void {
    ApiService.delete('stories', storyId);

    displayKanbanBoard();
}

function addStory(event: Event): void {
    event.preventDefault();

    const nameInput = document.getElementById('story-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('story-description') as HTMLInputElement;
    const prioritySelect = document.getElementById('story-priority') as HTMLSelectElement;
    const projectInput = document.getElementById('story-project') as HTMLInputElement;
    const ownerIdInput = document.getElementById('story-owner') as HTMLSelectElement;

    const name = nameInput.value;
    const description = descriptionInput.value;
    const priority = prioritySelect.value as 'low' | 'medium' | 'high';
    const project = parseInt(projectInput.value);
    const ownerId = ownerIdInput.value ? parseInt(ownerIdInput.value) : undefined; // Sprawdzamy, czy właściciel został wybrany
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

    ApiService.add('stories', newStory);

displayKanbanBoard();

    nameInput.value = '';
    descriptionInput.value = '';
    prioritySelect.value = 'low';
    projectInput.value = '';
    ownerIdInput.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
      const addStoryForm = document.getElementById('add-story-form');
    if (addStoryForm) {
        addStoryForm.addEventListener('submit', addStory);
    }
    displayKanbanBoard();
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
