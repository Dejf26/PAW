// projectService.ts
import { Project } from "../interfaces/projectInterface";
import { ResourceService } from "./resourceService";

export class ProjectService extends ResourceService<Project> {
  constructor() {
    super('projects');
  }

  protected saveResources(): void {
    localStorage.setItem('projects', JSON.stringify(this.resources));
  }

  getOne(id: number): Project | undefined {
    return super.getOne(id);
  }
}
