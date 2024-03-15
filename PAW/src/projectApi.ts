import { Project } from "./projectInterface";

export class ProjectApi {
  static getProjects(): Project[] {
    const projectsJson = localStorage.getItem('projects');
    return projectsJson ? JSON.parse(projectsJson) : [];
  }

  static saveProjects(projects: Project[]): void {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  static addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  }

  static updateProject(updatedProject: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === updatedProject.id);

    if (index !== -1) {
      projects[index] = updatedProject;
      this.saveProjects(projects);
    }
  }

  static deleteProject(projectId: number): void {
    const projects = this.getProjects();
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    this.saveProjects(updatedProjects);
  }
}