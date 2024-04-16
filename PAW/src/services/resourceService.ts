export abstract class ResourceService<T extends { id: number }> {
    protected resources: T[];
  
    constructor(private resourceName: string) {
      this.resources = JSON.parse(localStorage.getItem(this.resourceName) || '[]');
    }
  
    protected abstract saveResources(): void;
  
    getAll(): T[] {
      return this.resources;
    }
  
    getOne(id: number): T | undefined {
      return this.resources.find(resource => resource.id === id);
    }
  
    add(resource: T): void {
      this.resources.push(resource);
      this.saveResources();
    }
  
    update(updatedResource: T): void {
      const index = this.resources.findIndex(resource => resource.id === updatedResource.id);
      if (index !== -1) {
        this.resources[index] = updatedResource;
        this.saveResources();
      }
    }
  
    delete(id: number): void {
      this.resources = this.resources.filter(resource => resource.id !== id);
      this.saveResources();
    }
  }
  