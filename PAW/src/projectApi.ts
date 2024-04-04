import { Project } from "./interfaces/projectInterface";
import { ProjectService } from "./projectService";

const projectService = new ProjectService();

export class ProjectApi {
  static getProjects(): Project[] {
    return projectService.getAllProjects();
  }

  static getProjectById(id: number): Project | undefined {
    return projectService.getProjectById(id);
  }

  static addProject(project: Project): void {
    projectService.addProject(project);
  }

  static updateProject(updatedProject: Project): void {
    projectService.updateProject(updatedProject);
  }

  static deleteProject(projectId: number): void {
    projectService.deleteProject(projectId);
  }
}
