import { compare } from "bcryptjs";
import { ServiceAPIResponse, ServiceAuthResponse } from "../types/service-auth-response";
import { IUser } from "../types/types";
import prisma from "../utils/client";
import { generateToken } from "../utils/jwt";
import { validatedUser } from "../types/validator";
import { hashPassword } from "../utils/bcrypt";
import AppError from "../utils/AppError";

export default class AuthService {
  public static async login(email: string, password: string): Promise<ServiceAuthResponse<IUser>> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new AppError("User not found", 404);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

    const token = generateToken(user.id, user.email, user.role);


    return {
      success: true,
      message: "Login successful",
      body: {
         ...user,
         password: "_"
      },
      token
    };
  }

  public static async signup(userInfo: IUser): Promise<ServiceAPIResponse<IUser>> {
    const user = validatedUser(userInfo);

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) throw new AppError("Email already exists", 400);

    const newUser = await prisma.user.create({
      data: { ...user, password: await hashPassword(user.password) }
    });

  

    return {
      success: true,
      message: "User created successfully!",
      body: newUser
    };
  }

  public static async getUser(userId: string): Promise<ServiceAPIResponse<IUser>> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new AppError("User not found", 404);


    return {
      success: true,
      message: "User retrieved successfully",
       body: {
         ...user,
         password: '_'
      },
    };
  }
}