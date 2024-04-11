// import { User } from "./userInterface";

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  storyId: number;
  assignedTo?: string;
  estimatedTime: number;
  state: 'todo' | 'doing' | 'done';
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
}
