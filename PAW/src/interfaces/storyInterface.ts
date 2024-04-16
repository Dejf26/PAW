export interface Story {
    id: number;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    project: number;
    createdAt: Date;
    status: 'todo' | 'doing' | 'done';
    ownerId?: number;
}