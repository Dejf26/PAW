// user.ts
import { User as UserModel, UserRole } from "./interfaces/userInterface";

export class User {
  private static instance: User | null = null;
  private static readonly mockAdminUser: UserModel = { id: 1, firstName: "John", lastName: "Doe", role: UserRole.ADMIN }; // Mock zalogowanego użytkownika z rolą admin
  private static readonly mockDeveloperUser: UserModel = { id: 2, firstName: "Jane", lastName: "Smith", role: UserRole.DEVELOPER };
  private static readonly mockDevOpsUser: UserModel = { id: 3, firstName: "Tom", lastName: "Brown", role: UserRole.DEVOPS };
  private static readonly userList: UserModel[] = [User.mockAdminUser, User.mockDeveloperUser, User.mockDevOpsUser]; // Lista użytkowników

  private constructor() {}

  static getInstance(): User {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  getUsers(): UserModel[] {
    return User.userList;
  }

  getUser(): UserModel {
    return User.mockAdminUser;
  }

  setUserRole(role: UserRole): void {
    User.mockAdminUser.role = role;
  }
}



// const user = User.getInstance();
// user.setUserRole(UserRole.DEVELOPER); // Ustawienie roli użytkownika na developer