import { Project } from "./interfaces/projectInterface";
import { Story } from "./interfaces/storyInterface";
import { ProjectService } from "./projectService";
import { StoryService } from "./storyService";

export class apiService {
    private static projectService = new ProjectService();
    private static storyService = new StoryService();

    static getProjects(): Project[] {
        return this.projectService.getAllProjects();
    }

    static getProjectById(id: number): Project | undefined {
        return this.projectService.getProjectById(id);
    }

    static addProject(project: Project): void {
        this.projectService.addProject(project);
    }

    static updateProject(updatedProject: Project): void {
        this.projectService.updateProject(updatedProject);
    }

    static deleteProject(projectId: number): void {
        this.projectService.deleteProject(projectId);
    }

    //

    static getStories(): Story[] {
        return this.storyService.getAllStories();
    }

    static getStoriesByProjectId(projectId: number): Story[] {
        return this.storyService.getAllStories().filter(story => story.project === projectId);
    }

    static getStoryById(storyId: number): Story | undefined {
        return this.storyService.getStoryById(storyId);
    }

    static addStory(story: Story): void {
        this.storyService.addStory(story);
    }

    static updateStory(updatedStory: Story): void {
        this.storyService.updateStory(updatedStory);
    }

    static deleteStory(storyId: number): void {
        this.storyService.deleteStory(storyId);
    }
}
