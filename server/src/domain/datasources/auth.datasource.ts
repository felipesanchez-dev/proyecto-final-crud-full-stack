import { UserEntity } from "../entities/user.entity";
import { LoginUserDto, RegisterUserDto } from "..";

export abstract class AuthDatasource {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;

  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
