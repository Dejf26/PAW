import { Task } from "../interfaces/taskInterface";
import { ApiService } from '../services/apiService';
import { TaskService } from "../services/taskService";
import { createNavbar, setUserDisplayName } from "./navbar";
import { User } from "./user";
import { UserRole } from "../interfaces/userInterface";


createNavbar();
setUserDisplayName();

ApiService.registerService('tasks', new TaskService());

function displayTaskDetailsModal(task: Task): void {
    const modal = document.getElementById('task-details-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = '';

            const nameParagraph = document.createElement('p');
            nameParagraph.textContent = `Name: ${task.name}`;
            modalContent.appendChild(nameParagraph);

            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.textContent = `Description: ${task.description}`;
            modalContent.appendChild(descriptionParagraph);

            const priorityParagraph = document.createElement('p');
            priorityParagraph.textContent = `Priority: ${task.priority}`;
            modalContent.appendChild(priorityParagraph);

            const storyIdParagraph = document.createElement('p');
            storyIdParagraph.textContent = `Story ID: ${task.storyId}`;
            modalContent.appendChild(storyIdParagraph);

            const assignedToUser = User.getInstance().getUsers().find(user => user.id === parseInt(task.assignedTo ?? 'Unasigned'));
            if (assignedToUser) {
                const assignedToParagraph = document.createElement('p');
                assignedToParagraph.textContent = `Assigned To: ${task.assignedTo ?? 'Unassigned'}`; // Użycie operatora ?? aby obsłużyć wartość undefined
                modalContent.appendChild(assignedToParagraph);
            } else {
                 const assignedToParagraph = document.createElement('p');
            assignedToParagraph.textContent = `Assigned To: ${task.assignedTo ?? 'Unassigned'}`; // Użycie operatora ?? aby obsłużyć wartość undefined
            modalContent.appendChild(assignedToParagraph);

            }

            const estimatedTimeParagraph = document.createElement('p');
            estimatedTimeParagraph.textContent = `Estimated Time: ${task.estimatedTime}`;
            modalContent.appendChild(estimatedTimeParagraph);

            const stateParagraph = document.createElement('p');
            stateParagraph.textContent = `State: ${task.state}`;
            modalContent.appendChild(stateParagraph);

            const createdAtParagraph = document.createElement('p');
            createdAtParagraph.textContent = `Created At: ${task.createdAt}`;
            modalContent.appendChild(createdAtParagraph);

            const startDateParagraph = document.createElement('p');
            startDateParagraph.textContent = `Start Date: ${task.startDate}`;
            modalContent.appendChild(startDateParagraph);

            const endDateParagraph = document.createElement('p');
            endDateParagraph.textContent = `End Date: ${task.endDate}`;
            modalContent.appendChild(endDateParagraph);

            const closeButton = document.getElementById('close-modal-btn');
            if (closeButton) {
                closeButton.onclick = () => modal.style.display = 'none';
            }

            modal.style.display = 'block';
        }
    } else {
        console.error('Modal not found');
    }
}

window.onclick = (event) => {
    const modal = document.getElementById('task-details-modal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
};

function createTaskElement(task: Task): HTMLElement {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-card');
    taskElement.innerHTML = `
        <!-- HTML dla karty zadania -->
        <strong>${task.name}</strong>
        <button class="btn-edit" data-id="${task.id}">Edit</button>
        <button class="btn-delete" data-id="${task.id}">Delete</button>
        <button class="btn-details" data-id="${task.id}">Details</button>
    `;

    const editButton = taskElement.querySelector('.btn-edit');
    const deleteButton = taskElement.querySelector('.btn-delete');
    const detailsButton = taskElement.querySelector('.btn-details');

    if (editButton) {
        editButton.addEventListener('click', () => openEditModal(task));
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', () => deleteTask(task.id));
    }

    if (detailsButton) {
        detailsButton.addEventListener('click', () => displayTaskDetailsModal(task));
    }

    return taskElement;
}

const todoList = document.getElementById('todo-list');
const doingList = document.getElementById('doing-list');
const doneList = document.getElementById('done-list');

function displayTasksInKanban(tasks: Task[]) {
    if (todoList && doingList && doneList) {
        todoList.innerHTML = '';
        doingList.innerHTML = '';
        doneList.innerHTML = '';

        tasks.forEach((task: Task) => {
            const taskElement = createTaskElement(task);
            if (task.state === 'todo') {
                todoList.appendChild(taskElement);
            } else if (task.state === 'doing') {
                doingList.appendChild(taskElement);
            } else if (task.state === 'done') {
                doneList.appendChild(taskElement);
            }
        });
    } else {
        console.error('One or more task lists are missing');
    }
}

async function displayKanbanBoard() {
    const tasks = await ApiService.getAll<Task>('tasks');
    displayTasksInKanban(tasks);
}

document.addEventListener('DOMContentLoaded', () => {
    displayKanbanBoard();
});



async function openEditModal(task: Task): Promise<void> {
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        const editTaskNameInput = document.getElementById('edit-task-name') as HTMLInputElement;
        const editTaskDescriptionInput = document.getElementById('edit-task-description') as HTMLInputElement;
        const editTaskPriorityInput = document.getElementById('edit-task-priority') as HTMLSelectElement;
        const editTaskStoryIdInput = document.getElementById('edit-task-story') as HTMLInputElement;
        const editTaskAssignedToSelect = document.getElementById('edit-task-assigned') as HTMLSelectElement;

        if (editTaskNameInput && editTaskDescriptionInput && editTaskPriorityInput && editTaskStoryIdInput && editTaskAssignedToSelect) {
            editTaskNameInput.value = task.name;
            editTaskDescriptionInput.value = task.description;
            editTaskPriorityInput.value = task.priority;
            editTaskStoryIdInput.value = task.storyId.toString();

            const userList = User.getInstance().getUsers().filter(user => 
                user.role === UserRole.DEVELOPER || user.role === UserRole.DEVOPS
            );
            
            editTaskAssignedToSelect.innerHTML = '';
            userList.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id.toString();
                option.textContent = `${user.firstName} ${user.lastName} (${user.role})`;
                editTaskAssignedToSelect.appendChild(option);
            });

            const assignedUserId = userList.findIndex(user => user.id === parseInt(task.assignedTo ?? ''));
            editTaskAssignedToSelect.selectedIndex = assignedUserId;

            const saveChangesButton = document.getElementById('save-changes-button');
            if (saveChangesButton) {
                saveChangesButton.onclick = () => saveChanges(task);
            }

            const cancelButton = document.getElementById('cancel-button');
            if (cancelButton) {
                cancelButton.onclick = () => editModal.style.display = 'none';
            }

            const modalContent = editModal.querySelector('.modal-content');
            if (modalContent) {
                let markAsDoneButton = modalContent.querySelector('.mark-as-done-button') as HTMLButtonElement;
                if (!markAsDoneButton) {
                    markAsDoneButton = document.createElement('button') as HTMLButtonElement;
                    markAsDoneButton.textContent = 'Mark as Done';
                    markAsDoneButton.classList.add('mark-as-done-button');
                    modalContent.appendChild(markAsDoneButton);
                }
        
                markAsDoneButton.setAttribute('data-task-id', task.id.toString());
        
                markAsDoneButton.addEventListener('click', async () => {
                    task.state = 'done'; 
                    task.endDate = new Date(); 

                    await ApiService.update<Task>('tasks', task);
                    displayKanbanBoard();
                    editModal.style.display = 'none';


                });
            } else {
                console.error('Modal content not found');
            }

            editModal.style.display = 'block';
        }
    }
}

function saveChanges(task: Task): void {
    const editTaskNameInput = document.getElementById('edit-task-name') as HTMLInputElement;
    const editTaskDescriptionInput = document.getElementById('edit-task-description') as HTMLInputElement;
    const editTaskPriorityInput = document.getElementById('edit-task-priority') as HTMLSelectElement;
    const editTaskStoryIdInput = document.getElementById('edit-task-story') as HTMLInputElement;
    const editTaskAssignedToSelect = document.getElementById('edit-task-assigned') as HTMLSelectElement;

    const newName = editTaskNameInput.value;
    const newDescription = editTaskDescriptionInput.value;
    const newPriority = editTaskPriorityInput.value as 'low' | 'medium' | 'high';
    const newStoryId = parseInt(editTaskStoryIdInput.value);
    const assignedToUserId = parseInt(editTaskAssignedToSelect.value); 

    const assignedToUser = User.getInstance().getUsers().find(user => user.id === assignedToUserId);

    let assignedTo = 'Unassigned';
    if (assignedToUser) {
        assignedTo = `${assignedToUser.firstName} ${assignedToUser.lastName} (${assignedToUser.role})`;
    }

    const updatedTask: Task = {
        id: task.id,
        name: newName,
        description: newDescription,
        priority: newPriority,
        storyId: newStoryId,
        assignedTo: assignedTo,
        estimatedTime: 0, 
        state: 'doing', 
        createdAt: task.createdAt,
        startDate: new Date(), 
        endDate: undefined 
    };

    ApiService.update<Task>('tasks', updatedTask);

    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.style.display = 'none';
    }

    displayKanbanBoard();
}


function deleteTask(taskId: number): void {
    ApiService.delete('tasks', taskId);
    displayKanbanBoard(); 
}


function addTask(event: Event): void {
    event.preventDefault();

    const nameInput = document.getElementById('task-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('task-description') as HTMLInputElement;
    const prioritySelect = document.getElementById('task-priority') as HTMLSelectElement;
    const storyIdInput = document.getElementById('task-story') as HTMLInputElement;
    const estimatedTimeInput = document.getElementById('task-estimated-time') as HTMLInputElement;

    const name = nameInput.value;
    const description = descriptionInput.value;
    const priority = prioritySelect.value as 'low' | 'medium' | 'high';
    const storyId = parseInt(storyIdInput.value);
    const estimatedTime = parseInt(estimatedTimeInput.value);


    const newTask: Task = {
        id: Date.now(), 
        name,
        description,
        priority,
        storyId,
        assignedTo: undefined,
        estimatedTime,
        state: 'todo',
        createdAt: new Date(),
        startDate: undefined,
        endDate: undefined
    };

    ApiService.add<Task>('tasks', newTask);

    displayKanbanBoard();

    nameInput.value = '';
    descriptionInput.value = '';
    prioritySelect.value = 'low';
    storyIdInput.value = '';
    estimatedTimeInput.value='';
}

document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', addTask);
    }

    displayKanbanBoard();
});

const toggleTaskFormButton = document.getElementById('toggle-task-form-button');

if (toggleTaskFormButton) {
    toggleTaskFormButton.addEventListener('click', () => {
        const addTaskForm = document.getElementById('add-task-form');
        if (addTaskForm) {
            addTaskForm.classList.toggle('hidden-fields');
        }
    });
}
