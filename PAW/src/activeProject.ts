import { User } from "./user";

const user = User.getInstance();
const userNameElement = document.getElementById('user-name');
if (userNameElement) {
  userNameElement.textContent = user.getUser().firstName;
}

document.addEventListener('DOMContentLoaded', () => {
    const activeProjectId = localStorage.getItem('activeProjectId');
    if (activeProjectId) {
        // Tutaj możesz użyć zapytania do API lub lokalnego przechowywania danych, aby pobrać szczegóły aktywnego projektu
        const projectDetailsContainer = document.querySelector('.project-details') as HTMLElement;
        if (projectDetailsContainer) {
            projectDetailsContainer.innerText = 'Szczegóły aktywnego projektu ID: ' + activeProjectId;
        }
    } else {
        console.error('Brak aktywnego projektu');
    }
});