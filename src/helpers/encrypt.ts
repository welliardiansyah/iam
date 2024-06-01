import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { UserLoginDto } from "../dto/User.Dto";

dotenv.config();
const { JWT_SECRET = "" } = process.env;
export class encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: UserLoginDto) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

}