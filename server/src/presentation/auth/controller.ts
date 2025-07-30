import { Request, Response } from "express";
import {
  AuthRepository,
  CustomError,
  LoginAdmin,
  LoginUser,
  LoginUserDto,
  RegisterUser,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    UserModel.find({}, { password: 0 }) // Excluir el password
      .then((users) => {
        res.json(users);
      })
      .catch(() => res.status(500).json({ error: "Internal server error" }));
  };

  revalidateToken = async (req: Request, res: Response) => {
    const { user } = req.body;

    const token = await JwtAdapter.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    if (!token) return this.handleError("Error generating token", res);

    res.json({
      user,
      token,
    });
  };

  loginAdmin = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new LoginAdmin(this.authRepository)
      .execute(loginUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
}
