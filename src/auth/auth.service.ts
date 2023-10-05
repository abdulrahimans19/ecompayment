import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/sign';
import { LoginDto } from './dto/login';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const { name, email, password, roles } = signUpDto;
    const hashpass = await bcrypt.hash(password, 10);
    await this.userModel.create({
      name,
      email,
      password: hashpass,
      roles,
    });
    return 'User successfully created';
  }
  


  async login(loginDto: LoginDto): Promise<{ token: string; users: any }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email ');
    }
    const isPassmatch = await bcrypt.compare(password, user.password);
    if (!isPassmatch) {
      throw new UnauthorizedException('Invalid  password');
    }

    const payload = {
      id: user._id,
      roles: user.roles,
    };
    const token = jwt.sign(payload,process.env.JWT_SECRET);
    return { token, users: { id: user._id } };
  }
}
