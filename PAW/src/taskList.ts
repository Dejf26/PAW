import { Task } from "./interfaces/taskInterface";
import { ApiService } from './apiService';
import { TaskService } from "./taskService";
import { createNavbar, setUserDisplayName } from "./navbar";
import { User } from "./user";
import { UserRole } from "./interfaces/userInterface";


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

function displayTasks(): void {
    const tasks = ApiService.getAll<Task>('tasks');

    const taskList = document.getElementById('task-list');
    if (taskList) {
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    } else {
        console.error('Task list not found');
    }
}

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

            // Pobranie listy użytkowników z klasy User
            const userList = User.getInstance().getUsers().filter(user => 
                user.role === UserRole.DEVELOPER || user.role === UserRole.DEVOPS
            );
            
            // Wypełnienie pola wyboru użytkownikami
            editTaskAssignedToSelect.innerHTML = '';
            userList.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id.toString();
                option.textContent = `${user.firstName} ${user.lastName} (${user.role})`;
                editTaskAssignedToSelect.appendChild(option);
            });

            // Wybór aktualnie przypisanego użytkownika
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

            // Deklaracja zmiennej modalContent
            const modalContent = editModal.querySelector('.modal-content');
            if (modalContent) {
                // Sprawdzamy, czy przycisk Mark as Done już istnieje wewnątrz aktualnego zadania
                let markAsDoneButton = modalContent.querySelector('.mark-as-done-button') as HTMLButtonElement;
                // Jeśli nie istnieje, tworzymy nowy przycisk
                if (!markAsDoneButton) {
                    markAsDoneButton = document.createElement('button') as HTMLButtonElement;
                    markAsDoneButton.textContent = 'Mark as Done';
                    markAsDoneButton.classList.add('mark-as-done-button'); // Dodanie klasy CSS
                    modalContent.appendChild(markAsDoneButton);
                }
        
                // Ustawienie atrybutu data-task-id na przycisku "Mark as Done"
                markAsDoneButton.setAttribute('data-task-id', task.id.toString());
        
                // Dodajemy słuchacza zdarzeń do przycisku "Mark as Done"
                markAsDoneButton.addEventListener('click', async () => {
                    task.state = 'done'; // Zmiana stanu zadania na "done"
                    task.endDate = new Date(); // Ustawienie daty zakończenia na bieżącą datę
        
                    // Aktualizacja zadania w API
                    await ApiService.update<Task>('tasks', task);
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
    const assignedToUserId = parseInt(editTaskAssignedToSelect.value); // Pobieramy ID wybranego użytkownika

    // Znajdujemy użytkownika na podstawie wybranego ID
    const assignedToUser = User.getInstance().getUsers().find(user => user.id === assignedToUserId);

    let assignedTo = 'Unassigned'; // Domyślna wartość, jeśli użytkownik nie zostanie znaleziony
    if (assignedToUser) {
        assignedTo = `${assignedToUser.firstName} ${assignedToUser.lastName} (${assignedToUser.role})`;
    }

    const updatedTask: Task = {
        id: task.id,
        name: newName,
        description: newDescription,
        priority: newPriority,
        storyId: newStoryId,
        assignedTo: assignedTo, // Przypisujemy pełne dane użytkownika
        estimatedTime: 0, // Domyślnie ustawiono na 0, możesz zmienić to, jeśli jest potrzeba
        state: 'doing', // Zmiana stanu na "doing"
        createdAt: task.createdAt, // Ustawienie daty utworzenia na wartość oryginalną
        startDate: new Date(), // Ustawienie daty startu na bieżącą datę
        endDate: undefined // Domyślnie ustawiono na undefined, możesz zmienić to, jeśli jest potrzeba
    };

    ApiService.update<Task>('tasks', updatedTask);

    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.style.display = 'none';
    }

    displayTasks();
}


function deleteTask(taskId: number): void {
    ApiService.delete('tasks', taskId);
    displayTasks(); // Ponowne wyświetlenie listy zadań po usunięciu zadania
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

    displayTasks();

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

    displayTasks();
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
