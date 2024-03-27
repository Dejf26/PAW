// user.ts
import { User as UserModel } from "./interfaces/userInterface";

export class User {
  private static instance: User | null = null;
  private static readonly mockUser: UserModel = { id: 1, firstName: "John", lastName: "Doe" }; // Mock zalogowanego użytkownika

  private constructor() {}

  static getInstance(): User {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance;
  }

  getUser(): UserModel {
    return User.mockUser;
  }
}
