import { Injectable } from "../../../src/di/mod.ts";

export interface UserModel {
  id: string;
  login: string;
}

@Injectable()
export class AuthService {
  validate(login: string, password: string): UserModel | undefined {
    if (login === "admin" && password === "admin") {
      return { id: "1", login: "admin" };
    }
    return undefined;
  }
}
