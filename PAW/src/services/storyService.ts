import { Story } from "../interfaces/storyInterface";
import { ResourceService } from "./resourceService";

export class StoryService extends ResourceService<Story> {
  constructor() {
    super('stories');
  }

  protected saveResources(): void {
    localStorage.setItem('stories', JSON.stringify(this.resources));
  }
}
