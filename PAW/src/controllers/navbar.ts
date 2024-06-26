import { User } from "./user";
import "/src/styles/navbar.css";


export function setUserDisplayName(): void {
    const user = User.getInstance();
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = user.getUser().firstName;
    }
}

export function createNavbar(): void {

    
    const navbarContainer = document.createElement('nav');
    navbarContainer.classList.add('navbar');

    const navContainer = document.createElement('div');
    navContainer.classList.add('nav-container');

    const logo = document.createElement('h1');
    logo.classList.add('logo');
    logo.textContent = 'ManagMe';

    const navLinks = document.createElement('div');
    navLinks.id = 'nav-links';

    const allProjectsLink = document.createElement('a');
    allProjectsLink.href = 'index.html';
    allProjectsLink.textContent = 'All Projects';

    const activeProjectLink = document.createElement('a');
    activeProjectLink.href = '/src/pages/activeProjects.html';
    activeProjectLink.textContent = 'Active Project';

    const storiesLink = document.createElement('a');
    storiesLink.href = '/src/pages/stories.html';
    storiesLink.textContent = 'Stories';

    const tasksLink = document.createElement('a');
    tasksLink.href = '/src/pages/tasks.html';
    tasksLink.textContent = 'Tasks';

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');
    const userName = document.createElement('span');
    userName.id = 'user-name';
    userInfo.appendChild(document.createTextNode('Welcome '));
    userInfo.appendChild(userName);

    navLinks.appendChild(allProjectsLink);
    navLinks.appendChild(activeProjectLink);
    navLinks.appendChild(storiesLink);
    navLinks.appendChild(tasksLink);


    navContainer.appendChild(logo);
    navContainer.appendChild(navLinks);
    navContainer.appendChild(userInfo);

    navbarContainer.appendChild(navContainer);

    document.body.appendChild(navbarContainer);
}
