import { Database } from '../database.ts';
import { Injectable } from '../../../src/mod.ts';

export interface User{
  name: string;
  age: number;
}
@Injectable()
export class UserService {
  constructor(private db: Database){
  }
  async getUsers(): Promise<User[]> {
    return (await this.db.query("SELECT * FROM users;")).rows;
  }
}

