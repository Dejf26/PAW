import { Task } from "../interfaces/taskInterface";
import { ResourceService } from "./resourceService";

export class TaskService extends ResourceService<Task> {
  constructor() {
    super('tasks');
  }

  protected saveResources(): void {
    localStorage.setItem('tasks', JSON.stringify(this.resources));
  }
}
