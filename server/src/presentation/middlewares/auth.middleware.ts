import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).json({ error: "No token provided" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      const user = await UserModel.findById(payload.id);
      if (!user)
        return res
          .status(401)
          .json({ error: "Invalid token - user not found" });

      req.body.user = UserMapper.userEntityFromObject(user);

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    if (!user) {
      return res.status(500).json({ error: "Usuario no validado" });
    }

    if (!user.roles.includes("ADMIN_ROLE")) {
      return res
        .status(403)
        .json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }

    next();
  };
}
