export class ApiService {
    private static services: { [key: string]: any } = {};
  
    static registerService(serviceName: string, serviceInstance: any): void {
      this.services[serviceName] = serviceInstance;
    }
  
    static add<T>(serviceName: string, item: T): void {
      const service = this.services[serviceName];
      if (service && service.add) {
        service.add(item);
      }
    }
  
    static getAll<T>(serviceName: string): T[] {
      const service = this.services[serviceName];
      if (service && service.getAll) {
        return service.getAll();
      }
      return [];
    }
  
    static getOne<T>(serviceName: string, itemId: number): T | undefined {
      const service = this.services[serviceName];
      if (service && service.getOne) {
        return service.getOne(itemId);
      }
      return undefined;
    }
  
    static update<T>(serviceName: string, item: T): void {
      const service = this.services[serviceName];
      if (service && service.update) {
        service.update(item);
      }
    }
  
    static delete(serviceName: string, itemId: number): void {
      const service = this.services[serviceName];
      if (service && service.delete) {
        service.delete(itemId);
      }
    }
  }
  