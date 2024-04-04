import { Story } from "./interfaces/storyInterface";

export class StoryService {
    private stories: Story[];
  
    constructor() {
        this.stories = JSON.parse(localStorage.getItem('stories') || '[]');
    }
  
    getAllStories(): Story[] {
        return this.stories;
    }
  
    getStoryById(id: number): Story | undefined {
        return this.stories.find(story => story.id === id);
    }

    addStory(story: Story): void {
        this.stories.push(story);
        this.saveStories();
    }
  
    updateStory(updatedStory: Story): void {
        const index = this.stories.findIndex(story => story.id === updatedStory.id);
        if (index !== -1) {
            this.stories[index] = updatedStory;
            this.saveStories();
        }
    }
  
    deleteStory(id: number): void {
        this.stories = this.stories.filter(story => story.id !== id);
        this.saveStories();
    }
  
    private saveStories(): void {
        localStorage.setItem('stories', JSON.stringify(this.stories));
    }
}
