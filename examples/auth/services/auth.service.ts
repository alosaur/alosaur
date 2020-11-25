export interface UserModel {
  id: string;
  login: string;
}

export class AuthService {
  validate(login: string, password: string): UserModel | undefined {
    if (login === "admin" && password === "admin") {
      return { id: "1", login: "admin" };
    }
    return undefined;
  }
}
