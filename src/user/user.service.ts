import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRepository } from './user.repository';
import { User } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import globalErrorCodes  from 'constants/globalErrorCodes';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto):Promise<User> {
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if(existingUser) throw new BadRequestException('User already exist with this email', globalErrorCodes.userAlreadyExist);
    const createdUser = await this.userRepository.save(createUserDto);
    return this.convertUserEntityToDto(createdUser);
  }
  async getUserByEmail(email: string):Promise<User|null>{
    const userEntity = await this.userRepository.findOne({where:{email: email}});
    if(!userEntity) return null;
    return this.convertUserEntityToDto(userEntity);

  }

  private convertUserEntityToDto(userEntity: UserEntity) {
    const user = new User();
    user.id = userEntity.id.toString();
    user.email = userEntity.email;
    user.name = userEntity.name;
    user.password = userEntity.password;
    return user;
}

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
