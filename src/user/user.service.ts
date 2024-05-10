import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRepository } from './user.repository';
import { User } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private saltOrRounds = 10;
  private errorCodes = {
    userAlreadyExist: "USER_ALREADY_EXIST",
    userNotFound: "USER_NOT_FOUND"
  }
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto):Promise<User> {
    const existingUser = await this.userRepository.findOne({where:{email: createUserDto.email}});
    if(existingUser) throw new BadRequestException('User already exist with this email', this.errorCodes.userAlreadyExist);
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltOrRounds);
    createUserDto.password = hashedPassword;
    const createdUser = await this.userRepository.save(createUserDto);
    return this.convertUserEntityToDto(createdUser);
  }

  async authenticateUser(email: string, password: string):Promise<User|null>{
    const userEntity = await this.userRepository.findOne({where:{email: email}});
    if(!userEntity) return null;
    if(!(await bcrypt.compare(password, userEntity.password))) return null;
    return this.convertUserEntityToDto(userEntity);
  }

  async getUserByEmail(email: string):Promise<User>{
    const userEntity = await this.userRepository.findOne({where:{email: email}});
    if(!userEntity) throw new NotFoundException("User not found", this.errorCodes.userNotFound);
    return this.convertUserEntityToDto(userEntity);
  }

  private convertUserEntityToDto(userEntity: UserEntity) {
    const user = new User();
    user.id = userEntity.id.toString();
    user.email = userEntity.email;
    user.name = userEntity.name;
    return user;
}

}
