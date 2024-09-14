import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
