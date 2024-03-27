// ProjectService.ts
import { Project } from "./interfaces/projectInterface";

export class ProjectService {
   private projects: Project[];
  
    constructor() {
      this.projects = JSON.parse(localStorage.getItem('projects') || '[]');
    }
  
    getAllProjects(): Project[] {
      return this.projects;
    }
  
    getProjectById(id: number): Project | undefined {
      return this.projects.find(project => project.id === id);
    }
  
    addProject(project: Project): void {
      this.projects.push(project);
      this.saveProjects();
    }
  
    updateProject(project: Project): void {
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.projects[index] = project;
        this.saveProjects();
      }
    }
  
    deleteProject(id: number): void {
      this.projects = this.projects.filter(project => project.id !== id);
      this.saveProjects();
    }
  
    private saveProjects(): void {
      localStorage.setItem('projects', JSON.stringify(this.projects));
    }
  }