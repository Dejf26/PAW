export interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: UserRole;
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    DEVOPS = 'devops',
    DEVELOPER = 'developer'
  }